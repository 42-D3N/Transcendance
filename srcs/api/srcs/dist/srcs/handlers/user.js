import { and, eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { users } from "../db/schema.js";
import bcrypt, { hashSync } from "bcryptjs";
import { CustomError } from "../lib/custom-error.js";
import { HandleParsingError, handleErrorCode } from "./error.js";
import { validationResult } from "express-validator";
export async function adduser(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return (HandleParsingError(result, next));
    }
    try {
        const { username, email, password } = req.body;
        const already = await db.select({ username: users.username, password: users.password }).from(users).where(and(eq(users.email, email), eq(users.username, username)));
        console.log(already.length);
        if (already.length !== 0) {
            console.log("user already in database");
            return next(new CustomError("user already in database", 400));
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const Data = await db.insert(users).values({
            username,
            email,
            password: hashedPassword
        }).returning();
        delete Data[0].password;
        console.log("User added", Data);
        res.status(201).json({ Data });
    }
    catch (error) {
        const { username } = req.body;
        const used = await db.select({ username: users.username }).from(users).where(eq(users.username, username));
        if (handleErrorCode(error, next, used))
            return;
        console.log("Failed to add user ", error.cause.code);
        next(new CustomError("Failed to add user", 500));
    }
}
export async function getalluser(req, res, next) {
    try {
        const Data = await db.select().from(users);
        for (let i = 0; Data[i]; i++) {
            delete Data[i].password;
            delete Data[i].email;
        }
        console.log("All users", Data);
        res.status(200).json({ Data });
    }
    catch (error) {
        console.log("Failed to fetch all users ", error.cause.code);
        next(new CustomError("Failed to fetch all Users", 500));
    }
}
export async function getuserid(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        console.log("Error while parsing request");
        return next(new CustomError(JSON.stringify(result.array()), 400));
    }
    try {
        const { username } = req.body;
        const Data = await db
            .select()
            .from(users)
            .where(eq(users.username, username));
        console.log(req.body.username);
        if (Data.length === 0) {
            console.log("User not found");
            return next(new CustomError("User not found", 404));
        }
        delete Data[0].password;
        delete Data[0].email;
        console.log("user", Data);
        res.status(200).json({ Data });
    }
    catch (error) {
        console.log("Failed to fetch user ", error.cause.error);
        next(new CustomError("Failed to fetch user", 500));
    }
}
export async function admingetuserid(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        console.log("Error while parsing request");
        return next(new CustomError(JSON.stringify(result.array()), 400));
    }
    try {
        const Data = await db
            .select()
            .from(users)
            .where(eq(users.username, req.body.username));
        if (Data.length === 0) {
            console.log("User not found");
            return next(new CustomError("User not found", 404));
        }
        delete Data[0].password;
        console.log("user", Data);
        res.status(200).json({ Data });
    }
    catch (error) {
        console.log("Failed to fetch user ", error.cause.error);
        next(new CustomError("Failed to fetch user", 500));
    }
}
export async function deleteuser(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        console.log("Error while parsing request");
        return next(new CustomError(JSON.stringify(result.array()), 400));
    }
    try {
        const Data = await db
            .delete(users)
            .where(eq(users.id, +req.params.id))
            .returning({
            deleteDataId: users.id,
        });
        if (Data.length == 0) {
            console.log("User not found");
            return next(new CustomError("User not found", 404));
        }
        console.log("deleted user", Data);
        res.status(200).json({ Data });
    }
    catch (error) {
        console.log("Failed to delete user ", error.cause.code);
        next(new CustomError("Failed to delete user", 500));
    }
}
export async function updateuser(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        console.log("Error while parsing request");
        return (HandleParsingError(result, next));
    }
    try {
        const update_data = { ...req.body };
        if (update_data.password) {
            update_data.password = await bcrypt.hash(update_data.password, 10);
        }
        const Data = await db
            .update(users)
            .set(update_data)
            .where(eq(users.id, Number(req.params.id)))
            .returning();
        if (Data.length == 0) {
            console.log("User not found");
            return next(new CustomError("User not found", 404));
        }
        delete Data[0].password;
        console.log("user updated", Data);
        res.status(200).json({ Data });
    }
    catch (error) {
        const { username } = req.body;
        const used = await db.select({ username: users.username }).from(users).where(eq(users.username, username));
        if (handleErrorCode(error, next, used))
            return;
        console.log("Failed to update user ", error.cause.code);
        next(new CustomError("Failed to update user", 500));
    }
}
export async function P_updateuser(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        console.log("Error while parsing request");
        return (HandleParsingError(result, next));
    }
    try {
        const update_data = { ...req.body };
        update_data.password = await bcrypt.hash(update_data.password, 10);
        const Data = await db
            .update(users)
            .set(update_data)
            .where(eq(users.id, +req.params.id))
            .returning();
        if (Data.length == 0) {
            console.log("User not found");
            return next(new CustomError("User not found", 404));
        }
        delete Data[0].password;
        console.log("user updated", Data);
        res.status(201).json({ Data });
    }
    catch (error) {
        const { username } = req.body;
        const used = await db.select({ username: users.username }).from(users).where(eq(users.username, username));
        if (handleErrorCode(error, next, used))
            return;
        console.log("Failed to update user ", error.cause.code);
        next(new CustomError("Failed to update Data", 500));
    }
}
//# sourceMappingURL=user.js.map