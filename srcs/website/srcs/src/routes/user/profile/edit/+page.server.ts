import { createJWT, validateJWT } from '$lib/server/user_management/jwt.js';
import { redirect, fail } from '@sveltejs/kit';
import { randomBytes } from 'crypto';
import { db } from '$lib/server/db/index';
import { users } from '$lib/server/db/schema';
import { eq, or } from 'drizzle-orm';
import type { Actions } from './$types';
import { writeFile, readdir, mkdir } from 'fs/promises';
import path from 'path';

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

    if (!JWTtoken || JWTtoken === '-1')
    {
        cookies.set('JWTtoken', '-1', { path: '/' });
        throw redirect(308, '/sign_in');
    }
    else
    {
        let userInfos = await validateJWT(JWTtoken);

        if (!userInfos)
        {
            cookies.set('JWTtoken', "-1", { path: '/' });
            throw redirect(303, '/sign_in');
        }
        if (userInfos["JWT"] != undefined)
        {
            cookies.set('JWTtoken', userInfos["JWT"], { path: '/' });
            throw redirect(303, "./edit");
        }

        if (userInfos["empty"] == 0)
		{
			cookies.set('JWTtoken', "-1", { path: '/' });
			throw redirect(303, '/login');
		}

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
        icon: icon
    });
};


export const actions = {
    default: async (event) => {
        const form = await event.request.formData();

        const isUsername:RegExp = /^.{4,128}$/;
        const isEmail:RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const icon = form.get('icon') as File;
        const newName = form.get('username') as string;
        const newMail = form.get('email') as string;
        let userInfos = await validateJWT(event.cookies.get('JWTtoken'));
        if (!newName || !isUsername.test(newName))
            return (fail(400, {newName, invalidName: true }));
        if (!newMail || !isEmail.test(newMail))
            return (fail(400, {newMail, invalidMail: true }));

        let bdInfos = (await db.select({ username: users.username, email: users.email, id: users.id }).from(users).where(or(eq(newName, users.username), eq(newMail, users.email))));
        bdInfos.forEach((entry) => {
            if (entry.id != userInfos.id)
                return (fail(400, {bdInfos, somethingExists: true }));

        });

        if (newName != userInfos.username)
        {
            console.log("changing {user_id}",userInfos.id,"username: ",userInfos.username,"->",newName);
            await db.update(users).set({username: newName}).where(eq(users.id, userInfos.id));
        }
        
        if (newMail != userInfos.email)
        {
            console.log("changing {user_id}",userInfos.id,"email: ",userInfos.email,"->",newMail);
            await db.update(users).set({email: newMail}).where(eq(users.id, userInfos.id));
        }

        if (icon && icon.size != 0)
        {
            let randomString = randomBytes(48);

            if (!userInfos)
                return console.log("failed to retrieve user information");
            
            const buffer = Buffer.from(await icon.arrayBuffer());
            const uploadDir = path.resolve('/user/profile/userIcons');
            const end = icon.name.split('.');
            const filePath = path.join(uploadDir, randomString.toString('hex')+"."+end[end.length - 1]);
            await db.update(users).set({icon: '/userIcons/'+randomString.toString('hex')+"."+end[end.length - 1]}).where(eq(users.id, userInfos.id));
            await writeFile(filePath, buffer);
            console.log("Saving new icon as: "+filePath);
            
            if (userInfos.icon)
            {
                const res = await event.fetch(`${userInfos.icon}`, {
                    method: 'DELETE'
                });
                console.log("deleting old icon");
            }
            userInfos.icon = randomString.toString("hex")+"."+end[end.length - 1];
            console.log("changing {user_id}",userInfos.id,"icon: ",userInfos.icon,"->\n",randomString.toString("hex")+"."+end[end.length - 1]);
        }

        const updatedJWT = await createJWT(userInfos);
        event.cookies.set('JWTtoken', updatedJWT, { path: '/' });
        throw redirect(303, "../profile");
    }
} satisfies Actions;
