import type { Response, Request, NextFunction } from "express";
import { CustomError } from "../lib/custom-error.ts";
import jwt from "jsonwebtoken";
import { login } from "../handlers/auth.ts";

export const authMiddleware = (req, res, next) => {
    const token = req.header("Token");
    if (!token) {
        console.log("No acces token find")
        return next(new CustomError("No acces token find", 401));
    }
    try {
        const decoted = jwt.verify(token, 'your_secret_key');
        req.user = decoted;
        next ();
    } catch (err) {
        console.log("invalid token");
        return next(new CustomError("No acces token find", 401));
    }
}

export const roleMiddleware = (requiredRole) => (req, res, next) => {
    if (req.user.role !== requiredRole) {
        console.log("Wrong role. acces forbiden");
        return next(new CustomError("Wrong role. acces forbiden", 403));
    }
    console.log("aaaa");
    next();
} 