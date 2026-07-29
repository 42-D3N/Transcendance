
import { createHmac } from 'crypto';
import { env } from '$env/dynamic/private';

export function generateHmacSha256(key: string, message: string): string {
    return createHmac('sha256', key)
        .update(message)
        .digest('hex');
}

export function createJWT( payload: any ){

    if (!env.SECRET_KEY_JWT) throw new Error("JWT encryption key not set (SECRET_KEY_JWT undefined)");

    let header = {
        "alg": "HS256",
        "typ": "JWT"
    }
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const signature = btoa(env.SECRET_KEY_JWT);

    return (encodedHeader+"."+encodedPayload+"."+btoa(generateHmacSha256(signature, encodedHeader+"."+encodedPayload)));
}

export function validateJWT( Token:string ){
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
            return (userInfos);
    }
    catch (error)
    {
        console.log(error);
        return (null);
    }
    
    console.log("error retrieving user infos from JWT payload");
    return ({});
}