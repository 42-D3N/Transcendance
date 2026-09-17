import { validateJWT } from '$lib/server/user_management/jwt.js';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
  const JWTtoken = cookies.get('JWTtoken');

  if (!JWTtoken || JWTtoken === '-1')
    throw redirect(308, '/login');
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
      throw redirect(308, "/game");
    }
  }
}
