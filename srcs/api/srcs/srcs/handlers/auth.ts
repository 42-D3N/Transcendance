import type { Response, Request, NextFunction } from "express";
import { validationResult, type ValidationError } from "express-validator";
import { CustomError } from "../lib/custom-error.ts";
import bcrypt from "bcryptjs";
import { db } from "../db/db.ts";
import { api_users, users } from "../db/schema.ts";
import { handleErrorCode, HandleParsingError } from "./error.ts";
import { eq } from "drizzle-orm";
import { generateHexString } from "../lib/custom-key.ts";
import jwt from "jsonwebtoken";
const expire_time = '1h';

export async function register(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return (HandleParsingError(result, next));
    }
    try {
        const { email, password }  = req.body;
        const user = await db.select({email: users.email, password: users.password, id: users.id}).from(users).where(eq(users.email, email));
        if (user.length === 0) {
            return next (new CustomError("Error: Api register wrong credentials", 400)); 
        }
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return next( new CustomError("Error: Api register wrong credentials", 400));
        }
        const isdup = await db.select({id: api_users.user}).from(api_users).where(eq(api_users.user, user[0].id));
        if (isdup.length !== 0) {
            return next(new CustomError("Error: user already register to the api", 400));
        }
        const secret_key = generateHexString();
        const Data = await db.insert(api_users).values({
            user: user[0].id,
            secret_key: secret_key
        }).returning();
        delete Data[0].secret_key;
        console.log("Api user added",Data);
        res.status(201).json({ Data });
    } catch (error) {
        if (handleErrorCode(error, next, null))
            return;
        next(new CustomError("Error: Failed to add api user", 500));
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return (HandleParsingError(result, next));
    }
    try {
        const { email, password } = req.body;
        const user = await db.select({email: users.email, password: users.password, id: users.id}).from(users).where(eq(users.email, email));
        if (user.length === 0) {
            return next (new CustomError("Error: Api register wrong credentials", 400));
        }
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return next( new CustomError("Error: Api register wrong credentials", 400));
        }
        const role = await db.select({role: api_users.role, secret_key: api_users.secret_key}).from(api_users).where(eq(api_users.user, user[0].id));
        const token = jwt.sign(
            { id: user[0].id, role: role[0].role },
            role[0].secret_key,
            {algorithm: 'HS256',  expiresIn: expire_time });
        console.log(`user: ${user[0].id}\nrole: ${role[0].role}`);
        res.status(201).json({ token, message: 'Logged in successfuly', role: role[0].role, });
    } catch (error) {
        if (handleErrorCode(error, next, null))
            return;
        next(new CustomError("Error: Failed to add api user", 500));
    }
}

export async function deleteapiuser(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return (HandleParsingError(result, next));
    }
    try {
        const { email, password } = req.body;
        const user = await db.select({email: users.email, password: users.password, id: users.id}).from(users).where(eq(users.email, email));
        if (user.length === 0) {
            return next (new CustomError("Error: Api register wrong credentials", 400));
        }
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return next( new CustomError("Error: Api wrong password", 400));
        }
        const ishere = await db.select({id: api_users.user}).from(api_users).where(eq(api_users.user, user[0].id));
        if (ishere.length === 0) {
            return next(new CustomError("Error: user not register in api", 400));
        }
        const Data = await db.delete(api_users).where(eq(api_users.user, user[0].id)).returning()
        console.log("delete user form api user ", Data);
        res.status(200).json({ "msg": "User delete from the data base" });
    } catch (error) {
        next (new CustomError("Error: Failedto delete user", 500));
    }
}