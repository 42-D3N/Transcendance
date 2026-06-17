import type { PageServerLoad, Actions } from './$types';
import * as db from "$lib/server/db"

// export const load: PageServerLoad = async ({ cookies }) => {
// 	const user = await db.getUserFromSession(cookies.get('sessionid'));
// 	return { user };
// };
export interface User 
{
    id: number,
    email: string,
    username: string,
    password: string
}

export const actions = {
    register: async (event) => {
        try
        {
            const form = await event.request.formData();
            const object = Object.fromEntries(form.entries())
            var json = JSON.stringify(object);

            console.log(form,"\n\n\n", json, "\n\n\n\n\n");
            const response = await fetch("http://localhost:4242/api/user", {      
                method: 'POST',
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
            
            console.log(userData);
            return (userData);
        }
        catch (error)
        {
            console.error("Erreur lors de la requête :", error);
	    }
        return (null);
    }
} satisfies Actions;