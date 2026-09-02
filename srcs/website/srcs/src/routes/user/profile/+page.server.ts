import { redirect } from '@sveltejs/kit';
import { validateJWT } from '$lib/server/user_management/jwt.js';

export async function load ({ cookies }) {
    let JWTtoken = cookies.get('JWTtoken');
    let id = '-1';
    let username = '';
    let email = '';
    let wins = '0';
    let losses = '0';
    let matches = '0';
    let wallet = '0';
    let icon = 'default.svg';

    if (!JWTtoken || JWTtoken === '-1')
    {
        cookies.set('JWTtoken', '-1', { path: '/' });
        throw redirect(308, '/sign_in');
    }
    else
    {
        let userInfos = await validateJWT(JWTtoken);

        if (!userInfos)
        {
            cookies.set('JWTtoken', "-1", { path: '/' });
            throw redirect(303, '/sign_in');
        }
        if (userInfos["JWT"] != undefined)
        {
            cookies.set('JWTtoken', userInfos["JWT"], { path: '/' });
            throw redirect(303, "./profile");
        }

        if (userInfos["empty"] == 0)
		{
			cookies.set('JWTtoken', "-1", { path: '/' });
			throw redirect(303, '/login');
		}

        id = userInfos.id;
        username = userInfos.username;
        email = userInfos.email;
        wins = userInfos.wins;
        losses = userInfos.losses;
        matches = userInfos.matches;
        wallet = userInfos.wallets;
        if (userInfos.icon != '')
            icon = userInfos.icon
    }

    return ({
        Token: JWTtoken,
        id: id,
        username: username,
        email: email,
        wins: wins,
        losses: losses,
        matches: matches,
        wallet: wallet,
        icon: icon
    });
};
