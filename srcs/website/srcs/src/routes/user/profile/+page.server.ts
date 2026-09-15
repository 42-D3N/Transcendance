import { redirect, fail } from '@sveltejs/kit';
import { validateJWT } from '$lib/server/user_management/jwt.js';
import type { Actions } from './$types';
import { db } from '$lib/server/db/index';
import { eq, and, or } from 'drizzle-orm';
import { users, friends } from '$lib/server/db/schema';


export async function load ({ cookies }) {
    let JWTtoken = cookies.get('JWTtoken');
    let id = '-1';
    let username = '';
    let email = '';
    let wins = '0';
    let losses = '0';
    let matches = '0';
    let wallet = '0';
    let icon = 'default.svg';
    let friendRequests = [];
    let requestsInfos: {id: number; username: string; icon: string | null}[] = [];
    let copinous = [];
    let actualFriends: {id: number; username: string; icon: string | null}[] = [];

    if (!JWTtoken || JWTtoken === '-1')
    {
        cookies.set('JWTtoken', '-1', { path: '/' });
        throw redirect(308, '/login');
        throw redirect(308, '/login');
    }
    else
    {
        let userInfos = await validateJWT(JWTtoken);

        if (!userInfos)
        {
            cookies.set('JWTtoken', "-1", { path: '/' });
            throw redirect(303, '/login');
        }
        if (userInfos["JWT"] != undefined)
        {
            cookies.set('JWTtoken', userInfos["JWT"], { path: '/' });
            throw redirect(303, "./profile");
        }

        if (userInfos["empty"] == 0)
		{
			cookies.set('JWTtoken', "-1", { path: '/' });
			throw redirect(303, '/login');
		}

        friendRequests = (await db.select({ user1: friends.user1, user2: friends.user2, isaccepted: friends.isaccepted })
            .from(friends)
            .where(and(eq(friends.user2, userInfos.id), eq(friends.isaccepted, false)))
            .limit(5)
        );

        copinous = (await db.select({ user1: friends.user1, user2: friends.user2, isaccepted: friends.isaccepted })
            .from(friends)
            .where(and(or(eq(friends.user2, userInfos.id), eq(friends.user1, userInfos.id)), eq(friends.isaccepted, true)))
        );

        requestsInfos = await Promise.all(
            friendRequests.map(async (request) => {
                let user: { id: number, username: string, icon: string | null, user1: number, user2: number}[] = await db
                    .select({
                        id: users.id,
                        username: users.username,
                        icon: users.icon
                    })
                    .from(users)
                    .where(eq(users.id, request.user1));
                user[0].user1 = request.user1;
                user[0].user2 = request.user2;
                return user[0];
            })
        );

        actualFriends = await Promise.all(
            copinous.map(async (request) => {
                let toFetch: number;
                if (request.user1 == userInfos.id)
                    toFetch = request.user2;
                else
                    toFetch = request.user1;

                let user: { id: number, username: string, icon: string | null, user1: number, user2: number}[] = await db
                    .select({
                        id: users.id,
                        username: users.username,
                        icon: users.icon
                    })
                    .from(users)
                    .where(eq(users.id, toFetch));
                return user[0];
            })
        );

        id = userInfos.id;
        username = userInfos.username;
        email = userInfos.email;
        wins = userInfos.wins;
        losses = userInfos.losses;
        matches = userInfos.matches;
        wallet = userInfos.wallets;
        if (userInfos.icon != '')
            icon = userInfos.icon
    }

    return ({
        Token: JWTtoken,
        id: id,
        username: username,
        email: email,
        wins: wins,
        losses: losses,
        matches: matches,
        wallet: wallet,
        icon: icon,
        friendRequests: requestsInfos,
        friends: actualFriends
    });
};

export const actions = {
    sendRequest: async (event) => {
        const form = await event.request.formData();
        
        let friend = form.get('username') as string;
        let infoTab = friend.split('#');

        if (infoTab.length != 2)
            return(fail(400, {friend, nameFormat: true}));
        
        if (infoTab[0] == "" || infoTab[1] == "")
            return(fail(400, {friend, nameFormat: true}));

        const friendId = parseInt(infoTab[1]);
        if (isNaN(friendId))
            return fail(400, { friend, nameFormat: true });
        
        let userNameFromId = (await db.select({ username: users.username }).from(users).where(eq(users.id, parseInt(infoTab[1]))));
        
        if (userNameFromId.length == 0)
            return(fail(400, {userNameFromId, accountNotFound: true}));
        
        if (userNameFromId[0].username != infoTab[0])
            return(fail(400, {userNameFromId, usernameNotMatching: true}));
        
        // check if its not me
        let userToken = event.cookies.get('JWTtoken');
        
        if (!userToken || userToken == '-1')
            throw redirect(303, '/login');
        
        let myUsername = (await validateJWT(userToken));

        if (myUsername.username == "")
            return(fail(400, {myUsername, tryAgain: true }));
        if (userNameFromId[0].username == myUsername.username)
            return(fail(400, {myUsername, sillyTester: true }));

        // check if not already friends
        let requestExisting = (await db.select({ user1:friends.user1, user2:friends.user2, isaccepted:friends.isaccepted })
        .from(friends)
        .where(and(
            eq(friends.user1, parseInt(infoTab[1])),
            eq(friends.user2, parseInt(infoTab[1]))
        )));

        if (requestExisting[0])
        {
            if (requestExisting[0].isaccepted)
                return (fail(400, {userNameFromId, relationExisting: true}));
            return (fail(400, {userNameFromId, requestPending: true}));
        }

        await db.insert(friends).values(
            {
                user1: myUsername.id,
                user2: parseInt(infoTab[1]),
                isaccepted: false
            }
        );
    },

    acceptRequest: async (event) => {
        const form = await event.request.formData();
        
        const user1 = form.get('user1') as string;
        const user2 = form.get('user2') as string;

        if (!user1 || !user2)
            return (fail(400, {user1, user2, dataError: true}));
        await db.update(friends).set({ isaccepted: true }).where(and(eq(parseInt(user1), friends.user1), eq(parseInt(user2), friends.user2)));
    },

    refuseRequest: async (event) => {
        const form = await event.request.formData();
        
        const user1 = form.get('user1');
        const user2 = form.get('user2');

        await db.delete(friends).where(and(eq(parseInt(user1), friends.user1), eq(parseInt(user2), friends.user2)));
    }
    
} satisfies Actions;
