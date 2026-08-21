import { redirect } from '@sveltejs/kit';
import { chatClient } from '$lib/chat-client';


export function load ({ cookies })  {
	
	chatClient.disconnect();
	let	JWTtoken = cookies.get('JWTtoken');

	if (JWTtoken != '-1')
	{
		cookies.set('JWTtoken', '-1', { path:'/' });
	}

	redirect(308, '/');
};