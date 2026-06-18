import type { Response, Request, NextFunction } from "express";
import { validationResult, type ValidationError } from "express-validator";
import { CustomError } from "../lib/custom-error.ts";
import bcrypt, { hashSync } from "bcryptjs";
import { db } from "../db/db.ts";
import { api_users } from "../db/schema.ts";
import { json } from "drizzle-orm/gel-core";
import { HandleParsingError } from "./error.ts";

export async function register(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return (HandleParsingError(result, next));
    }
    try {
        const { username, email, password }  = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const Data = await db.insert(api_users).values({
            username,
            email,
            password: hashedPassword
        }).returning();
        delete Data[0].password;
        console.log("Api user added",Data);
        res.status(201).json({ Data });
    } catch (error) {
        console.log("Failed to add api user ", error.cause.code);
        next(new CustomError("Failed to add api user", 500));
    }
}
