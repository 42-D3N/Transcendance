
import { createHmac } from 'crypto';
import { env } from '$env/dynamic/private';

import { db } from '$lib/server/db/index';
import { eq, lt, gte, ne } from 'drizzle-orm';
import { users } from '$lib/server/db/schema';



export function generateHmacSha256(key: string, message: string): string {
    return createHmac('sha256', key)
        .update(message)
        .digest('hex');
}

export async function createJWT( payload: any ){

    if (!env.SECRET_KEY_JWT) throw new Error("JWT encryption key not set (SECRET_KEY_JWT undefined)");

    let header = {
        "alg": "HS256",
        "typ": "JWT"
    }
    payload["created"] = Date.now();
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const signature = btoa(env.SECRET_KEY_JWT);

    return (encodedHeader+"."+encodedPayload+"."+btoa(generateHmacSha256(signature, encodedHeader+"."+encodedPayload)));
}

export async function validateJWT( Token:string ){
    let splittedInfos = Token.split('.');
    let encodedHeader =splittedInfos[0];
    let encodedPayload = splittedInfos[1];
    let hashedSignature = splittedInfos[2];

    if (!env.SECRET_KEY_JWT) throw new Error("JWT encryption key not set (SECRET_KEY_JWT undefined)"); 

    try
    {
        const signature = btoa(env.SECRET_KEY_JWT);

        let header = {
            "alg": "HS256",
            "typ": "JWT"
        }
        if (encodedHeader != btoa(JSON.stringify(header)))
            throw new Error("invalid JWT header, recieved header:\n\t"+encodedHeader+"\nexpected:\n\t"+btoa(JSON.stringify(header)));

        let verifyHash = btoa(generateHmacSha256(signature, encodedHeader+"."+encodedPayload));
        if (verifyHash != hashedSignature)
            throw new Error("invalid JWT signature, recieved signature:\n\t"+hashedSignature+"\nexpected:\n\t"+verifyHash);


        let userInfos = JSON.parse(atob(encodedPayload));
        if (userInfos)
        {
            let validToken = (await checkPayload(userInfos));
            if (validToken === 2 || validToken === 3)
                return ({ 'empty': 0 });
            if (validToken === 1)
                userInfos["JWT"] = await createJWT((await db.select({
                id:users.id,
                username:users.username,
                email:users.email,
                wins:users.wins,
                losses:users.losses,
                matches:users.matches,
                wallets:users.wallet,
                icon:users.icon,
                code:users.code,
                skin_rac:users.skin_rac,
                skin_ball:users.skin_ball})
                .from(users)
                .where(eq(users.id, userInfos["id"])))[0]);
            return (userInfos);
        }
    }
    catch (error)
    {
        return ({ 'empty': 0 });
    }
    
    console.log("error retrieving user infos from JWT payload");
    return ({ 'empty': 0 });
}

// 0 -> not modified; 1 -> modified; 2 -> expired; 3 -> non existing
async function checkPayload( payload:any ): Promise<number> {
    if (!payload)
        return (3);
    if (Date.now() > payload["created"] + 86_400_000)
        return (2);

    let userInfos = (await db.select({
        id:users.id,
        username:users.username,
        email:users.email,
        wins:users.wins,
        losses:users.losses,
        matches:users.matches,
        wallets:users.wallet,
        icon:users.icon,
        code:users.code,
        skin_rac:users.skin_rac,
        skin_ball:users.skin_ball}).from(users).where(eq(users.id, payload["id"])))[0];
    if (!userInfos)
        return (3);
    if (userInfos["username"] != payload["username"] ||
        userInfos["email"] != payload["email"] ||
        userInfos["wins"] != payload["wins"] ||
        userInfos["losses"] != payload["losses"] ||
        userInfos["matches"] != payload["matches"] ||
        userInfos["wallets"] != payload["wallets"] ||
        userInfos["icon"] != payload["icon"] ||
        userInfos["code"] != payload["code"] ||
        userInfos["skin_rac"] != payload["skin_rac"] ||
        userInfos["skin_ball"] != payload["skin_ball"]
    )
        return (1);
    return (0);
}
