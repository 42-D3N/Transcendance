import type { PageServerLoad, Actions } from './$types';
import * as db from "$lib/server/db"

// export const load: PageServerLoad = async ({ cookies }) => {
// 	const user = await db.getUserFromSession(cookies.get('sessionid'));
// 	return { user };
// };

export const actions = {
    register: async (event) => {
        const data = await event.request.formData();
        // const data = await ;
        
        const username = data.get('username');
        const email = data.get('email');
        const password = data.get('password');

        // il faudra se hasher le password

        console.log("logged in as", username);
    }
} satisfies Actions;