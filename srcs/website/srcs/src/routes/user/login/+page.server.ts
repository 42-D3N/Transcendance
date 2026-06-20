import type { PageServerLoad, Actions } from './$types';
import * as db from "$lib/server/db"
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
			const form = await event.request.formData();
			const object = Object.fromEntries(form.entries())
			var json = JSON.stringify(object);
			const response = await fetch("http://localhost:4242/api/user:", {      
				method: 'GET',
				headers: {
					"Content-Type": "application/json"
				},
				body: json
			})
			console.log(response);
			if (!response.ok)
				throw new Error(`HTTP error: ${response.status}`);
			
			const data = await response.json();
			const userData:User = {
				id:data.id,
				email:data.email,
				username:data.username,
				password:data.password
			};
			
			return (userData);
		}
		catch (error)
		{
			console.error("Erreur lors de la requête :", error);
		}
		return (null);
	}
} satisfies Actions;