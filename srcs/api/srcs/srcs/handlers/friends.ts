import { eq } from "drizzle-orm";
import { db } from "../db/db.ts";
import { friends } from "../db/schema.ts";
import type { Response, Request, NextFunction } from "express";
import { CustomError } from "../lib/custom-error.ts";
import { HandleParsingError, handleErrorCode } from "./error.ts";
import { validationResult, type ValidationError } from "express-validator";
import { customType } from "drizzle-orm/gel-core";

export async function deletefriends(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        console.log("Error while parsing request");
        return next(new CustomError(JSON.stringify(result.array()), 400));
    }
    try {
        const Data = await db
        .delete(friends)
        .where(eq(friends.user1, + req.body.user1) && (eq(friends.user2, + req.body.user2)))
        .returning({
            User1: friends.user1, 
            User2: friends.user2
        });
        if (Data.length == 0) {
            console.log("Users not found or not in friends list");
            return next (new CustomError("Error: Users not found or not in friends list", 404));
        }
        console.log("Deleted friends ", Data);
        res.status(200).json({ Data });
    } catch (error) {
        console.error("DELETE ERROR:", error);
        console.error("Code:", error?.code);
        console.error("Cause:", error?.cause);
        console.error("Cause code:", error?.cause?.code);
        return next (new CustomError("Error: Failed to delete Friend link", 500));
    }
}

export async function addfriends(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        console.log("Error while parsing request")
        return next (new CustomError(JSON.stringify(result.array()), 400));
    }
    try {
        const { user1, user2, isaccepted} = req.body;
        const Data = await db.insert(friends).values({
            user1,
            user2,
            isaccepted
        }).returning();
        console.log("Added friends", Data);
        res.status(201).json({ Data });
    } catch (error) {
        console.error("DELETE ERROR:", error);
        console.error("Code:", error?.code);
        console.error("Cause:", error?.cause);
        console.error("Cause code:", error?.cause?.code);
        if (handleErrorCode(error, next, null))
            return;
        next (new CustomError("Error: Failed to add friends", 500));
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
            return next (new CustomError("Error: user not found", 400));
        }
        console.log(`get friends list`,Data);
        res.status(200).json({ Data });
    } catch (error) {
        console.error("DELETE ERROR:", error);
        console.error("Code:", error?.code);
        console.error("Cause:", error?.cause);
        console.error("Cause code:", error?.cause?.code);
        next (new CustomError("Error: Failed to fetch friends", 500));
    }
}