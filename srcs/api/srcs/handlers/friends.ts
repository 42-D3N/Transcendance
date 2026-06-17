import { eq } from "drizzle-orm";
import { db } from "../db/db.ts";
import { friends } from "../db/schema.ts";
import type { Response, Request, NextFunction } from "express";
import { CustomError } from "../lib/custom-error.ts";
import { HandleParsingError, handleErrorCode } from "./error.ts";
import { validationResult, type ValidationError } from "express-validator";
import { customType } from "drizzle-orm/gel-core";

export async function addfriends(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        console.log("Error while parsing request")
        return next (new CustomError(JSON.stringify(result.array()), 400));
    }
    try {
        const { user1, user2, isaccepted} = req.body;
        console.log("BODY:", req.body);
        console.log("isaccepted:", isaccepted);
        console.log("typeof:", typeof isaccepted);
        const Data = await db.insert(friends).values({
            user1,
            user2,
            isaccepted
        }).returning();
        console.log(Data);
        res.status(201).json({ Data });
    } catch (error) {
        if (handleErrorCode(error, next))
            return;
        console.log("Failed to add user ", error.cause.code);
        next (new CustomError("Failed to add friends", 500));
    }
}

export async function getfriends(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()){
        console.log("Error while parsing request");
        return next(new CustomError(JSON.stringify(result.array()), 400));
    }
    try {
        const Data = await db
            .select()
            .from(friends)
            .where(eq(friends.user1, + req.params.id));
        if (Data.length == 0) {
            console.log("User not found");
            return next (new CustomError("user not found", 400));
        }
        console.log(Data);
        res.status(200).json({ Data });
    } catch (error) {
        console.log("Failed to fetch friends ", error.cause.code);
        next (new CustomError("Failed to fetch friends", 500));
    }
}