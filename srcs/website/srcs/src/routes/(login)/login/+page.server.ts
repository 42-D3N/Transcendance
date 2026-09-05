import type { PageServerLoad, Actions } from './$types';
import { FlowGraphFunctionReferenceBlock, type logOperation } from '@babylonjs/core';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db/index';
import { eq } from 'drizzle-orm';
import { users } from '$lib/server/db/schema';
import { createJWT } from '$lib/server/user_management/jwt.js';
import bcrypt from 'bcryptjs';

export const load = async ({ cookies }) => {
	const JWT = cookies.get('JWTtoken');

	if (JWT && JWT != '-1')
		redirect(303, '/');

};

export const actions = {
	login: async (event) => {
		try
		{
			const isUsername:RegExp = /^.{4,128}$/;
			const isEmail:RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

			const form = await event.request.formData();
            const username = form.get('username');
            const password = form.get('password');

			if (!username || username == "")
				return (fail(400, {username, emptyName: true }));
			if (!password || password == "")
				return (fail(400, {password, emptyPass: true }));

			if (!isEmail.test(username as string))
			{
				if (!isUsername.test(username as string))
					return (fail(400, {username, wrong: true }));
			}
			let userPass;

			if (isEmail.test(username as string))
				userPass = await db.select({ password: users.password }).from(users).where(eq(users.email, username as string));
			else
				userPass = await db.select({ password: users.password }).from(users).where(eq(users.username, username as string));

			if (userPass.length === 0)
				return (fail(400, {username, accNotFound: true }));
			
			if (!(await bcrypt.compare(password as string, userPass[0].password)))
				return (fail(400, {password, invalidPass: true }));
			else
			{
				let userInfos;
				if (isEmail.test(username as string))
					userInfos = await db.select({ 
					id:users.id,
					username:users.username,
					email:users.email,
					wins:users.wins,
					losses:users.losses,
					matches:users.matches,
					wallets:users.wallet,
					icon:users.icon,
					code:users.code,
					skin_rac:users.skin_rac,
					skin_ball:users.skin_ball,})
					.from(users)
					.where(eq(users.email, username as string));
				else
					userInfos = await db.select({
					id:users.id,
					username:users.username,
					email:users.email,
					wins:users.wins,
					losses:users.losses,
					matches:users.matches,
					wallets:users.wallet,
					icon:users.icon,
					code:users.code,
					skin_rac:users.skin_rac,
					skin_ball:users.skin_ball,})
					.from(users)
					.where(eq(users.username, username as string));
				const JWT = await createJWT(userInfos[0]);
				event.cookies.set('JWTtoken', JWT, { path: '/' });
			}

		}
		catch (error)
		{
			console.error("Erreur lors de la requête :", error);
		}
		throw redirect(303, '/');
	}
} satisfies Actions;
