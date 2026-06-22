import type { Response, Request, NextFunction } from "express";
import { validationResult, type ValidationError } from "express-validator";
import { CustomError } from "../lib/custom-error.ts";
import bcrypt from "bcryptjs";
import { db } from "../db/db.ts";
import { api_users, users } from "../db/schema.ts";
import { handleErrorCode, HandleParsingError } from "./error.ts";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
var expire_time = '1h';

export async function register(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return (HandleParsingError(result, next));
    }
    try {
        const { email, password }  = req.body;
        const user = await db.select({email: users.email, password: users.password, id: users.id}).from(users).where(eq(email, users.email));
        if (!user) {
            console.log("Api register no game user found");
            return new CustomError("Api register wrong credentials", 400);
        }
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            console.log("Api register wrong credentials");
            return next( new CustomError("Api register wrong credentials", 400));
        }
        const Data = await db.insert(api_users).values({
            user: user[0].id
        }).returning();
        console.log("Api user added",Data);
        res.status(201).json({ Data });
    } catch (error) {
		console.log(error)
        if (handleErrorCode(error, next, null))
            return;
        console.log("Failed to add api user ", error.cause.code);
        next(new CustomError("Failed to add api user", 500));
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return (HandleParsingError(result, next));
    }
    try {
        const { email, password } = req.body;
        const user = await db.select({email: users.email, password: users.password, id: users.id}).from(users).where(eq(email, users.email));
        if (!user) {
            console.log("Api register no game user found");
            return new CustomError("Api register wrong credentials", 400);
        }
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            console.log("Api register wrong credentials");
            return next( new CustomError("Api register wrong credentials", 400));
        }
        const role = await db.select({role: api_users.role}).from(api_users).where(eq(api_users.user, user[0].id));
        const token = jwt.sign({ id: user[0].id, role: role[0].role }, 'your_secret_key', { expiresIn: expire_time });
        console.log(`user: ${user[0].id}\nrole: ${role}\n token: ${token} valid for ${expire_time}`);
        res.status(201).json({ token, message: 'Logged in successfuly', role });
    } catch (error) {
        if (handleErrorCode(error, next, null))
            return;
        console.log("Failed to add api user ", error.cause.code);
        next(new CustomError("Failed to add api user", 500));
    }
}
