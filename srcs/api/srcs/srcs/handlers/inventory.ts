import { eq, and } from "drizzle-orm";
import { db } from "../db/db.ts";
import { users, shop, inventory } from "../db/schema.ts";
import type { Response, Request, NextFunction } from "express";
import { CustomError } from "../lib/custom-error.ts";
import { validationResult, type ValidationError } from "express-validator";
import { HandleParsingError } from "./error.ts";
import { handleErrorCode } from "./error.ts";


export async function additem(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return (HandleParsingError(result, next));
    }
    try {
        const {user, item} = req.body;
        if (!user || !item) {
            if (!user)
                return next (new CustomError("Error: User not in request", 400));
            if (!item)
                return next (new CustomError("Error: Item not in request", 400));
        }
        if (item > 8)
            return next (new CustomError("Error: No valid id for item", 400));
        const dbuser = await db.select({id: users.id}).from(users).where(eq(users.id, user));
        if (dbuser.length == 0)
            return next (new CustomError("Error: user does not exist", 400));
        const dbitem = await db.select({item: shop.id}).from(shop).where(eq(shop.id, item));
        if (dbitem.length == 0)
            return next (new CustomError("Error: item does not exist", 400));
        const dbown = await db.select({own: inventory.own}).from(inventory).where(and(eq(inventory.user, dbuser[0].id), eq(inventory.product, dbitem[0].item)));
        if (dbown[0].own === true)
            return next (new CustomError("Error: user already own the item", 400));
        const Data = await db.update(inventory).set({own: true}).where(and(eq(inventory.user, dbuser[0].id), eq(inventory.product, dbitem[0].item))).returning();
        console.log(`user: ${dbuser[0].id} now own item ${dbitem[0].item}`);
        res.status(201).json(`user: ${dbuser[0].id} now own item ${dbitem[0].item}`);
    }
    catch (error) {
        let used = null
        const { user } = req.body;
        if (user !== undefined && user !== null && user !== "") {
            used = await db.select({user: users.id}).from(users).where(eq(users.id, user));
        }
        if (handleErrorCode(error, next, used))
            return;
        next (new CustomError("Error: failed to add the item", 500));
    }
}

export async function removeitem(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return (HandleParsingError(result, next));
    }
    try {
        const {user, item} = req.body;
        if (!user || !item) {
            if (!user)
                return next (new CustomError("Error: User not in request", 400));
            if (!item)
                return next (new CustomError("Error: Item not in request", 400));
        }
        if (item > 8)
            return next (new CustomError("Error: No valid id for item", 400));
        const dbuser = await db.select({id: users.id}).from(users).where(eq(users.id, user));
        if (dbuser.length == 0)
            return next (new CustomError("Error: user does not exist", 400));
        const dbitem = await db.select({item: shop.id}).from(shop).where(eq(shop.id, item));
        if (dbitem.length == 0)
            return next (new CustomError("Error: item does not exist", 400));
        const dbown = await db.select({own: inventory.own}).from(inventory).where(and(eq(inventory.user, dbuser[0].id), eq(inventory.product, dbitem[0].item)));
        if (dbown[0].own === false)
            return next (new CustomError("Error: user already don't own the item", 400))
        const Data = await db.update(inventory).set({own: false}).where(and(eq(inventory.user, dbuser[0].id), eq(inventory.product, dbitem[0].item))).returning();
        console.log(`user: ${dbuser[0].id} now don't own item ${dbitem[0].item}`);
        res.status(201).json(`user: ${dbuser[0].id} now don't own item ${dbitem[0].item}`);
    }
    catch (error) {
        let used = null
        const { user } = req.body;
        if (user !== undefined && user !== null && user !== "") {
            used = await db.select({user: users.id}).from(users).where(eq(users.id, user));
        }
        if (handleErrorCode(error, next, used))
            return;
        next (new CustomError("Error: failed to remove the item", 500));
    }
}