import type { Response, Request, NextFunction } from "express";
import { CustomError } from "../lib/custom-error.ts";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../db/db.ts";
import { login } from "../handlers/auth.ts";
import { api_users, users } from "../db/schema.ts";

async function getuserid(decoded) {
    const user = await db.select({ secret: api_users.secret_key }).from(api_users).where(eq(decoded.id, api_users.user));
    return (user)
}

export const authMiddleware = async (req, res, next) => {
    const token = req.header("Token");
    if (!token) {
        console.log("No acces token find")
        return next(new CustomError("No acces token find", 401));
    }
    try {
        const decoded = jwt.decode(token);
        if (!decoded || typeof decoded !== "object" || !decoded.id) {
            console.log("invalid token");
            return next(new CustomError("Invalid token", 401));
        }
        const user = await getuserid(decoded);
        if (!user) {
            console.log("User not found");
            return next(new CustomError("User not found", 401));
        }
        const verified = jwt.verify(token, user[0].secret, { algorithms: ["HS256"] });
        req.user = verified;
        next ();
    } catch (err) {
        console.log("invalid token");
        return next(new CustomError("invalid token please relog to use the api", 401));
    }
}

export const roleMiddleware = (requiredRole) => (req, res, next) => {
    if (req.user.role !== requiredRole) {
        console.log("Wrong role. acces forbiden");
        return next(new CustomError("Wrong role. acces forbiden", 403));
    }
    next();
}