import { validateJWT } from '$lib/server/user_management/jwt.js';
import { redirect } from '@sveltejs/kit';
import { eq, lt, gte, ne } from 'drizzle-orm';
import { db } from '$lib/server/db/index';
import { json } from '@sveltejs/kit';
import { inventory } from '$lib/server/db/schema';



export async function load({ cookies }) {
    try
    {
        const JWTtoken = cookies.get('JWTtoken');
        
        if (!JWTtoken || JWTtoken === '-1') {
            throw redirect(303, '/login');
        }
        
        const userInfos = validateJWT(JWTtoken);
        
        if (!userInfos) {
            throw redirect(303, '/login');
        }
        
        const code = await db.select({ code:inventory.code }).from(inventory).where(eq(userInfos.id, inventory.user));
        
        return {
            Token: JWTtoken,
            id: userInfos.id,
            username: userInfos.username,
            email: userInfos.email,
            wins: userInfos.wins,
            losses: userInfos.losses,
            matches: userInfos.matches,
            wallet: userInfos.wallets,
            code: code[0].code,
        };
    }
    catch (error)
	{
		console.error("Erreur lors de la requête :", error);
	}
	throw redirect(303, '/');
}

export const actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();

        console.log(formData);
        const productId = Number(formData.get('productId'));
        const shep = Number(formData.get('shep'));
        const price = Number(formData.get('price'));

        const JWTtoken = cookies.get('JWTtoken');

        const userInfos = validateJWT(JWTtoken);

        if (!userInfos) {
            throw redirect(303, '/login');
        }

        console.log("JE SUIS LE BACKEND");
        console.log('Product:', productId);
        console.log('Shep:', shep);
        console.log('price:', price)
        console.log('User:', userInfos.id);



        return {
            success: true
        };
    }
};