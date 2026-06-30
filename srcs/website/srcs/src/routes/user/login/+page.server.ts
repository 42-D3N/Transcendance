import type { PageServerLoad, Actions } from './$types';
import * as db from "$lib/server/db";
import type { logOperation } from '@babylonjs/core';
import { stringify } from 'querystring';

// export const load: PageServerLoad = async ({ cookies }) => {
// 	const user = await db.getUserFromSession(cookies.get('sessionid'));
// 	return { user };
// };

export const actions = {
	login: async (event) => {
		try
		{
			
		}
		catch (error)
		{
			console.error("Erreur lors de la requête :", error);
		}
		return (null);
	}
} satisfies Actions;