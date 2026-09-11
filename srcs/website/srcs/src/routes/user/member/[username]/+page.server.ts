import { redirect, fail } from '@sveltejs/kit';
import { validateJWT } from '$lib/server/user_management/jwt.js';
import type { Actions } from './$types';
import { db } from '$lib/server/db/index';
import { eq, ne, or, and, count } from 'drizzle-orm';
import { users, friends } from '$lib/server/db/schema';


export async function load ({ cookies, params, fetch }) {
    let JWTtoken = cookies.get('JWTtoken');
    let id = '-1';
    let username = '';
    let email = '';
    let wins = '0';
    let losses = '0';
    let matches = '0';
    let wallet = '0';
    let icon = 'default.svg';
    let copinous = [];
    let actualFriends: {id: number; username: string; icon: string | null}[] = [];


    if (!JWTtoken || JWTtoken === '-1')
    {
        cookies.set('JWTtoken', '-1', { path: '/' });
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
            throw redirect(303, "/user/profile");
        }

        if (userInfos["empty"] == 0)
		{
			cookies.set('JWTtoken', "-1", { path: '/' });
			throw redirect(303, '/login');
		}

        let fetchedUser = await fetch(`/user/member/${params.username}`);
        let TakenInfos = await fetchedUser.json()

        if (TakenInfos.length == 0)
            throw redirect(308, "/user/profile");
        if (TakenInfos.privateAcc)
            return ({
                accPrivate: true
        });

        copinous = (await db.select({ user1: friends.user1, user2: friends.user2, isaccepted: friends.isaccepted })
            .from(friends)
            .where(and(or(eq(friends.user2, TakenInfos.id), eq(friends.user1, TakenInfos.id)), eq(friends.isaccepted, true)))
        );

        actualFriends = await Promise.all(
            copinous.map(async (request) => {
                let toFetch: number;
                if (request.user1 == TakenInfos.id)
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

        id = TakenInfos.id;
        username = TakenInfos.username;
        email = TakenInfos.email;
        wins = TakenInfos.wins;
        losses = TakenInfos.losses;
        matches = TakenInfos.matches;
        wallet = TakenInfos.wallet;
        if (TakenInfos.icon != '')
            icon = TakenInfos.icon
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
        friends: actualFriends,
        accPrivate: false
    });
};
