export function load ({ cookies })  {
	let id = cookies.get('id');
	let username = cookies.get('username');
	let email = cookies.get('email');

	if (!id || id === '-1')
	{
		cookies.set('id', '-1', { path: '/' });
		cookies.set('username', '', { path: '/' });
		cookies.set('email', '', { path: '/' });
		id = '-1';
		username = '';
		email = '';
	}


	return ({
		id: id,
		username: username,
		email: email
	});
};
