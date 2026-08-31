import { validationResult } from "express-validator";
import { CustomError } from "../lib/custom-error.js";
import bcrypt from "bcryptjs";
import { db } from "../db/db.js";
import { api_users, users } from "../db/schema.js";
import { handleErrorCode, HandleParsingError } from "./error.js";
import { eq } from "drizzle-orm";
import { generateHexString } from "../lib/custom-key.js";
import jwt from "jsonwebtoken";
var expire_time = '1h';
export async function register(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return (HandleParsingError(result, next));
    }
    try {
        const { email, password } = req.body;
        const user = await db.select({ email: users.email, password: users.password, id: users.id }).from(users).where(eq(email, users.email));
        if (user.length === 0) {
            console.log("Api register no game user found");
            return next(new CustomError("Api register wrong credentials", 400));
        }
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            console.log("Api register wrong credentials");
            return next(new CustomError("Api register wrong credentials", 400));
        }
        const isdup = await db.select({ id: api_users.user }).from(api_users).where(eq(user[0].id, api_users.user));
        if (isdup.length !== 0) {
            console.log("user already register to the api");
            return next(new CustomError("user already register to the api", 400));
        }
        const secret_key = generateHexString();
        const Data = await db.insert(api_users).values({
            user: user[0].id,
            secret_key: secret_key
        }).returning();
        delete Data[0].secret_key;
        console.log("Api user added", Data);
        res.status(201).json({ Data });
    }
    catch (error) {
        console.log(error);
        if (handleErrorCode(error, next, null))
            return;
        console.log("Failed to add api user ", error.cause.code);
        next(new CustomError("Failed to add api user", 500));
    }
}
export async function login(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return (HandleParsingError(result, next));
    }
    try {
        const secret = req.headers.secret;
        const { email, password } = req.body;
        const user = await db.select({ email: users.email, password: users.password, id: users.id }).from(users).where(eq(email, users.email));
        if (user.length === 0) {
            console.log("Api register no game user found");
            return next(new CustomError("Api register wrong credentials", 400));
        }
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            console.log("Api register wrong credentials");
            return next(new CustomError("Api register wrong credentials", 400));
        }
        const role = await db.select({ role: api_users.role, secret_key: api_users.secret_key }).from(api_users).where(eq(api_users.user, user[0].id));
        const token = jwt.sign({ id: user[0].id, role: role[0].role }, role[0].secret_key, { algorithm: 'HS256', expiresIn: expire_time });
        console.log(`user: ${user[0].id}\nrole: ${role[0].role}\nsecret: ${role[0].secret_key}\ntoken: ${token} valid for ${expire_time}`);
        res.status(201).json({ token, message: 'Logged in successfuly', role, secret: role[0].secret_key });
    }
    catch (error) {
        if (handleErrorCode(error, next, null))
            return;
        console.log("Failed to add api user ", error.cause.code);
        next(new CustomError("Failed to add api user", 500));
    }
}
export async function deleteapiuser(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return (HandleParsingError(result, next));
    }
    try {
        const { email, password } = req.body;
        const user = await db.select({ email: users.email, password: users.password, id: users.id }).from(users).where(eq(email, users.email));
        if (user.length === 0) {
            console.log("Api register no game user found");
            return next(new CustomError("Api register wrong credentials", 400));
        }
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            console.log("Api wrong password");
            return next(new CustomError("Api wrong password", 400));
        }
        const ishere = await db.select({ id: api_users.user }).from(api_users).where(eq(user[0].id, api_users.user));
        if (ishere.length === 0) {
            console.log("user not register in api");
            return next(new CustomError("user not register in api", 400));
        }
        const Data = await db.delete(api_users).where(eq(api_users.user, user[0].id)).returning();
        console.log("delete user form api user ", Data);
        res.status(200).json({ "msg": "User delete from the data base" });
    }
    catch (error) {
        console.log("Failed to delete user ", error.cause.code);
        next(new CustomError("Failedto delete user", 500));
    }
}
//# sourceMappingURL=auth.js.map