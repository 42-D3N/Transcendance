export function load ({ cookies })  {
	let id = cookies.get('id');
	let username = cookies.get('username');
	let email = cookies.get('email');
	let wins = cookies.get('wins');
	let losses = cookies.get('losses');
	let matches = cookies.get('matches');
	let wallet = cookies.get('wallet');

	if (!id || id === '-1')
	{
		cookies.set('id', '-1', { path: '/' });

		id = '-1';
		username = '';
		email = '';
		wins = '0';
		losses = '0';
		matches = '0';
		wallet = '0';
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

export const actions = {
    logout: async ({ cookies }) => {
        cookies.set('id', '-1', { path: '/'});
        cookies.delete('username', { path: '/' });
        cookies.delete('email', { path: '/' });
        cookies.delete('wins', { path: '/' });
        cookies.delete('losses', { path: '/' });
        cookies.delete('matches', { path: '/' });
        cookies.delete('wallet', { path: '/' });
    }
};