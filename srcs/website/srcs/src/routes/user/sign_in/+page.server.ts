import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import * as db from "$lib/server/db"

// export const load: PageServerLoad = async ({ cookies }) => {
// 	const user = await db.getUserFromSession(cookies.get('sessionid'));
// 	return { user };
// // };

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
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[^\s]{12,67}$/;
            const isUsername = /^.{3,128}$/;

            const form = await event.request.formData();
            const email = form.get('email');
            const username = form.get('username');
            const password = form.get('password');
            const object = Object.fromEntries(form.entries())
            var json = JSON.stringify(object);

            if (!email || email == "")
                return (fail(400, {email, empty: true }));
            if (!isEmail.test(email as string))
                return (fail(400, {email, wrong: true }));

            if (!isPass.test(password as string))
                return (fail(400, {password, skill_issue: true }));

            if (!isUsername.test(username as string))
                return (fail(400, {username, length_issue: true}));

            const response = await fetch("http://localhost:4242/api/user/", {
                method: 'POST',
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json"
                },
                body: json
            })

            if (!response.ok)
            {
                const test = await response.json();
                console.log(test);
                if (test.msg == "Username already exist")
                    return (fail(400, {username, username_exists: true}));

                if (test.msg == "Email already exist")
                    return (fail(400, {email, email_exists: true}));
            }
            
            const data = await response.json();
            const userData:User = {
                id:data.id,
                email:data.email,
                username:data.username,
                password:data.password
            };

            // cookies.set('User', userData);
        }
        catch (error)
        {
            console.error("Erreur lors de la requête :", error);
        }
    }
} satisfies Actions;