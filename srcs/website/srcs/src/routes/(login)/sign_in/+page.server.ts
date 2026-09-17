import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db/index';
import { eq, lt, gte, ne } from 'drizzle-orm';
import { users, inventory, shop } from '$lib/server/db/schema';
import { createJWT, validateJWT } from '$lib/server/user_management/jwt.js';
import bcrypt from 'bcryptjs';

export const load = async ({ cookies }) => {
	const JWT = cookies.get('JWTtoken');

	if (JWT && JWT != '-1')
    {
        let validation = validateJWT(JWT);
		redirect(303, '/');
    }
};

export const actions = {
    register: async (event) => {
        try
        {
            const isEmail:RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isPass:RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[^\s]{12,67}$/;
            const isUsername:RegExp = /^[a-zA-Z0-9_-]{4,128}$/;

            const form = await event.request.formData();
            const email = form.get('email');
            const username = form.get('username');
            const password = form.get('password');
            
            if (!isUsername.test(username as string))
                return (fail(400, {username, length_issue: true}));

            if (!email || email == "")
                return (fail(400, {email, empty: true }));

            if (!isEmail.test(email as string))
                return (fail(400, {email, wrong: true }));

            if (!isPass.test(password as string))
                return (fail(400, {password, skill_issue: true }));

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
            
            const userInfos = await db.select({
                id:users.id,
                username:users.username,
                email:users.email,
                wins:users.wins,
                losses:users.losses,
                matches:users.matches,
                wallets:users.wallet,
                code:users.code,
                skin_rac:users.skin_rac,
                skin_ball:users.skin_ball,
                privateAcc:users.privateAcc
            })
            .from(users)
            .where(eq(users.username, username as string));
            const products = await db.select().from(shop);
            await db.insert(inventory).values(
            products.map((product) => ({
                user: userInfos[0].id,
                product: product.id,
                own: false,})));
            if (userInfos.length > 0)
            {
                const JWT = await createJWT(userInfos[0]);

                event.cookies.set('JWTtoken', JWT, { path: '/' });
            }
        }
        catch (error)
        {
            console.error("Erreur lors de la requête :", error);
            return ;
        }
        throw redirect(303, '/');
    }
} satisfies Actions;