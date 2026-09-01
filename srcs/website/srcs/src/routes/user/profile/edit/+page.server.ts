import { createJWT, validateJWT } from '$lib/server/user_management/jwt.js';
import { redirect } from '@sveltejs/kit';
import { randomBytes } from 'crypto';
import { db } from '$lib/server/db/index';
import { users } from '$lib/server/db/schema';
import { eq, lt, gte, ne } from 'drizzle-orm';
import type { Actions } from './$types';
import { writeFile, readdir, mkdir } from 'fs/promises';
import path from 'path';

export const actions = {
    default: async ({ request, cookies }) => {
        const form = await request.formData();
        const icon = form.get('icon') as File;

        if (!icon || icon.size === 0) {
            console.log("No new icon uploaded");
        }
        else
        {
            let randomString = randomBytes(48);
            let userInfos = await validateJWT(cookies.get('JWTtoken'));

            if (!userInfos)
                return console.log("failed to retrieve user information");
            console.log(await db.select().from(users).where(eq(users.id, userInfos.id)));
            console.log("new icon name: "+randomString.toString("hex"));
            
            const buffer = Buffer.from(await icon.arrayBuffer());
            const uploadDir = path.resolve('/user/profile/userIcons');
            const end = icon.name.split('.');
            const filePath = path.join(uploadDir, randomString.toString('hex')+"."+end[end.length - 1]);
            await db.update(users).set({icon: '/userIcons/'+randomString.toString('hex')+"."+end[end.length - 1]}).where(eq(users.id, userInfos.id));
            console.log("File uploading:");
            
            console.log("Saving as: "+filePath);
            await writeFile(filePath, buffer);
            console.log("File Uploaded");
            
            userInfos.icon = randomString.toString("hex")+"."+end[end.length - 1];
            const updatedJWT = await createJWT(userInfos);
            cookies.set('JWTtoken', updatedJWT, { path: '/' });
        }
        throw redirect(303, "../profile");
    }
} satisfies Actions;

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

        if (userInfos.length == 0)
            console.error("couldn't retrieve userData");

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
