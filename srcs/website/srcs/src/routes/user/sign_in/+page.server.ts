import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db/index';
import { eq, lt, gte, ne } from 'drizzle-orm';
import { users } from '$lib/server/db/schema';
import { generateHmacSha256 } from '../../../ambient.d.ts';
import { env } from '$env/dynamic/private';
import bcrypt from 'bcryptjs';

export const actions = {
    register: async (event) => {
        try
        {
            const isEmail:RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isPass:RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[^\s]{12,67}$/;
            const isUsername:RegExp = /^.{3,128}$/;

            const form = await event.request.formData();
            const email = form.get('email');
            const username = form.get('username');
            const password = form.get('password');
            

            if (!email || email == "")
                return (fail(400, {email, empty: true }));

            if (!isEmail.test(email as string))
                return (fail(400, {email, wrong: true }));

            if (!isPass.test(password as string))
                return (fail(400, {password, skill_issue: true }));

            if (!isUsername.test(username as string))
                return (fail(400, {username, length_issue: true}));

            if ((await db.select().from(users).where(eq(users.username, username as string))).length != 0)
                return (fail(400, {username, username_exists: true }));

            if ((await db.select().from(users).where(eq(users.email, email as string))).length != 0)
                return (fail(400, {username, email_exists: true }));

            const hashedPassword = await bcrypt.hash(password as string, 10);
            await db.insert(users).values(
                {
                    username: username as string,
                    email: email as string,
                    password: hashedPassword
                }
            );
            
            const userInfos = await db.select({ id:users.id, username:users.username, email:users.email, wins:users.wins, losses:users.losses, matches:users.matches, wallets:users.wallet}).from(users).where(eq(users.username, username as string));
            if (userInfos.length > 0)
            {
                if (!env.SECRET_KEY_JWT) throw new Error("JWT encryption key not set (SECRET_KEY_JWT undefined)");

                let header = {
                    "alg": "HS256",
                    "typ": "JWT"
                }
                let payload = userInfos[0];
                const encodedHeader = btoa(JSON.stringify(header));
                const encodedPayload = btoa(JSON.stringify(payload));
                const signature = btoa(env.SECRET_KEY_JWT);

                const JWT = encodedHeader+"."+encodedPayload+"."+btoa(generateHmacSha256(signature, encodedHeader+"."+encodedPayload));
                console.log(JWT);

                event.cookies.set('JWTtoken', JWT, { path: '/' });
            }
        }
        catch (error)
        {
            console.error("Erreur lors de la requête :", error);
            return ;
        }
        throw redirect(307, '/');
    }
} satisfies Actions;