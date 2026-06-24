import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { db } from "$lib/server/db/index";
import { eq, lt, gte, ne } from 'drizzle-orm';
import { users } from "$lib/server/db/schema";
import bcrypt from "bcryptjs";

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
            
            db.insert(users).values({ username: username as string, email: email as string, password: hashedPassword });
            
        }
        catch (error)
        {
            console.error("Erreur lors de la requête :", error);
            return ;
        }
        throw redirect(303, '/user/login');
    }
} satisfies Actions;