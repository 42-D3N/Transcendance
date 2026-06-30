import { validateJWT } from '../ambient.d.ts';
import { redirect } from '@sveltejs/kit';

export function load ({ cookies })  {
	let JWTtoken = cookies.get('JWTtoken');
	let id = '-1';
	let username = '';
	let email = '';
	let wins = '0';
	let losses = '0';
	let matches = '0';
	let wallet = '0';

	if (!JWTtoken || JWTtoken === '-1')
	{
		cookies.set('JWTtoken', '-1', { path: '/' });
	}
	else
	{
		let userInfos = validateJWT(JWTtoken);

		if (!userInfos)
			throw redirect(308, '/user/login');

		if (userInfos.length == 0)
			console.error("couldn't retrieve userData");

		id = userInfos.id;
		username = userInfos.username;
		email = userInfos.email;
		wins = userInfos.wins;
		losses = userInfos.losses;
		matches = userInfos.matches;
		wallet = userInfos.wallets;
	}

	return ({
		id: id,
		username: username,
		email: email,
		wins: wins,
		losses: losses,
		matches: matches,
		wallet: wallet
	});
};