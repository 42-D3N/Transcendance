import { error, json } from '@sveltejs/kit';
import { readFile, unlink } from 'fs/promises';
import path from 'path';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/index';
import { eq, ne, or, and, count } from 'drizzle-orm';
import { users, friends } from '$lib/server/db/schema';


export const GET: RequestHandler = async ({ params }) => {

    let username = params.username.split('_');
    if (username.length != 2 || isNaN(parseInt(username[1])))
        return (json({}));
    let user = await db.select({
            id:users.id,
            username:users.username,
            email:users.email,
            wins:users.wins,
            losses:users.losses,
            matches:users.matches,
            wallet:users.wallet,
            icon:users.icon
        })
        .from(users)
        .where(eq(users.id, parseInt(username[1])))
    if (user.length == 0)
        return (json({}));

    return (json(user[0]));
};
