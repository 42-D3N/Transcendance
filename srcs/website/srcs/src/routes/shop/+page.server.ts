import { validateJWT } from '$lib/server/user_management/jwt.js';
import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { eq, lt, gte, ne, and } from 'drizzle-orm';
import { db } from '$lib/server/db/index';
import { json } from '@sveltejs/kit';
import { inventory, users } from '$lib/server/db/schema';
import { createJWT } from '../../lib/server/user_management/jwt';
import type { RequestEvent } from "@sveltejs/kit";
import { shop } from '../../lib/server/db/schema';



export async function load({ cookies }) {
    const JWTtoken = cookies.get('JWTtoken');
    
    if (!JWTtoken || JWTtoken === '-1') {
        throw redirect(308, '/login');
    }
    else
    {
        let userInfos = await validateJWT(JWTtoken);

        if (!userInfos)
        {
            cookies.set('JWTtoken', "-1", { path: '/' });
            throw redirect(308, '/login');
        }
        if (userInfos["JWT"] != undefined)
        {
            cookies.set('JWTtoken', userInfos["JWT"], { path: '/' });
            throw redirect(308, "/shop");
        }
        
        return {
            Token: JWTtoken,
            id: userInfos.id,
            username: userInfos.username,
            email: userInfos.email,
            wins: userInfos.wins,
            losses: userInfos.losses,
            matches: userInfos.matches,
            wallet: userInfos.wallets,
            code: userInfos.code,
        };
    }
}

export const actions = {
    default: async ({ request, cookies }) => {
        try
        {
            const formData = await request.formData();
            const JWTtoken = cookies.get('JWTtoken');
            const userInfos = await validateJWT(JWTtoken);

            if (!userInfos) {
                throw redirect(308, '/login');
            }
            const tmp = formData.get('code')
            if (tmp)
            {
                const result = await register_code(formData, userInfos);
                if (result?.success === true)
                {
                    await recreatejtw(cookies, userInfos);
                    return {
                        success: true
                    };
                }
                return {
                    success: false
                };
            }
            const product = JSON.parse(formData.get('product'));
            if (!product || !product.id)
                return {
                    success: false,
                    code: 10
                }
            const price = await db.select({ price:shop.price }).from(shop).where(eq(product.id, shop.id));
            const own = await db.select({ own:inventory.own }).from(inventory).where(and(eq(userInfos.id, inventory.user), eq(product.id, inventory.product)))
            if (!price || !price[0] || !price[0].price || !check_price(userInfos, price[0].price) || !own || !own[0] || own[0].own === null || own[0].own === true)
            {
                await recreatejtw(cookies, userInfos);
                if (!price || !price[0] || !price[0].price || !own || !own[0] || own[0].own === null)
                    return {
                        succes: false,
                        code: 10
                    }
                if (own[0].own === true)
                    return {
                        succes: false,
                        code: 2
                    }
                return {
                        success: false,
                        code: 1
                };
            }
            let mult = 1;
            if (userInfos.code === true)
                mult = 0.5;
            await db.update(users).set({ wallet: userInfos.wallets - (price[0].price * mult) }).where(eq(userInfos.id, users.id));
            await db.update(inventory).set({ own: true }).where(and(eq(userInfos.id, inventory.user), eq(product.id, inventory.product)));
            await recreatejtw(cookies, userInfos);
            return {
                success: true,
                code: 3
            };
        }
        catch (error) {
            console.error("Error: ", error);
        }
    }
};

async function register_code(form:any, data:any) {
    const input = form.get('code');
    if (input === 'Citadel')
    {
        try
        {
            const Data = await db.update(users).set({code: true}).where(eq(data.id, users.id)).returning();
            return {
                    success: true
            };
        }
        catch (error)
        {
            console.error("Error: ", error);
        }
    }
    return {
        success: false
    };
}

async function recreatejtw(cookies: RequestEvent["cookies"] ,data:any) {
    try 
    {
        let userInfos;
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
        .where(eq(users.id, data.id));
        const JWT = await createJWT(userInfos[0]);
        cookies.set('JWTtoken', JWT, { path: '/' })
    }
    catch (error)
    {
        console.error("Erreur lors de la recreation du jwt :", error);
    }
}

function check_price(Data:any, price:number)
{
    let mult = 1;
    if (Data.code === true)
        mult = 0.5;
    if (price * mult <= Data.wallets)
        return (1);
    return (0);
}