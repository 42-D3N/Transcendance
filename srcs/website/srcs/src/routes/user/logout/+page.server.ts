import { redirect } from '@sveltejs/kit';


export function load ({ cookies })  {
	
	let	JWTtoken = cookies.get('JWTtoken');

	if (JWTtoken != '-1')
	{
		cookies.set('JWTtoken', '-1', { path:'/' });
	}

	redirect(308, '/');
};