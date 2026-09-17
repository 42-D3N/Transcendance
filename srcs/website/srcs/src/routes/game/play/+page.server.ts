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
      throw redirect(308, "/game/play");
    }

    return {
      Token: JWTtoken,
      id: userInfos.id,
      username: userInfos.username,
      email: userInfos.email,
      wins: userInfos.wins,
      losses: userInfos.losses,
      matches: userInfos.matches,
      wallet: userInfos.wallets,
      icon: userInfos.icon,
      skin_rac: userInfos.skin_rac,
      skin_ball: userInfos.skin_ball,
    };
  }
}
