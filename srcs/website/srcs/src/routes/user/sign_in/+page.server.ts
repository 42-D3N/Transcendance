import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

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

                if (test.msg == "Username already exist")
                    return (fail(400, {username, username_exists: true}));

                if (test.msg == "Email already exist")
                    return (fail(400, {email, email_exists: true}));
                return (null);
            }
            
            const data = await response.json();

            event.cookies.set('id', data.Data[0].id, {path: '/'});
            event.cookies.set('username', data.Data[0].username, {path: '/'});
            event.cookies.set('email', data.Data[0].email, {path: '/'});
            // event.cookies.set('icon', data.icon, {path: '/user'});
        }
        catch (error)
        {
            console.error("Erreur lors de la requête :", error);
        }
    }
} satisfies Actions;