import { validateJWT } from '$lib/server/user_management/jwt.js';
import { redirect } from '@sveltejs/kit';

export function load({ cookies }) {
    const JWTtoken = cookies.get('JWTtoken');

    if (!JWTtoken || JWTtoken === '-1') {
        throw redirect(303, '/login');
    }

    const userInfos = validateJWT(JWTtoken);

    if (!userInfos) {
        throw redirect(303, '/login');
    }

    return {
        Token: JWTtoken,
        id: userInfos.id,
        username: userInfos.username,
        email: userInfos.email,
        wins: userInfos.wins,
        losses: userInfos.losses,
        matches: userInfos.matches,
        wallet: userInfos.wallets
    };
}