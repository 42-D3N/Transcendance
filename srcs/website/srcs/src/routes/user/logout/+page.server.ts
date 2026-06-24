import { redirect } from '@sveltejs/kit';


export function load ({ cookies })  {
	
	let	id = cookies.get('id');

	if (id != '-1')
	{
		cookies.delete('username', { path: '/' });
		cookies.delete('email', { path: '/' });
		cookies.delete('wins', { path: '/' });
		cookies.delete('losses', { path: '/' });
		cookies.delete('matches', { path: '/' });
		cookies.delete('wallet', { path: '/' });
		cookies.set('id', '-1', { path:'/' });
	}

	redirect(308, '/');
};