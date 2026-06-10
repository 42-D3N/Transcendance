import type { PageServerLoad, Actions } from './$types';
import * as db from "$lib/server/db"

// export const load: PageServerLoad = async ({ cookies }) => {
// 	const user = await db.getUserFromSession(cookies.get('sessionid'));
// 	return { user };
// };

export const actions = {
	login: async (event) => {
		console.log("logged in as");
		// TODO log the user in
	}
} satisfies Actions;