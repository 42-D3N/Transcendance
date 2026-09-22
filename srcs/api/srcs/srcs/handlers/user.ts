import { eq, and, or } from "drizzle-orm";
import { db } from "../db/db.ts";
import { users, shop, inventory } from "../db/schema.ts";
import bcrypt, { hashSync } from "bcryptjs";
import type { Response, Request, NextFunction } from "express";
import { CustomError } from "../lib/custom-error.ts";
import { HandleParsingError, handleErrorCode } from "./error.ts";
import { validationResult, type ValidationError } from "express-validator";

export async function adduser(req: Request, res: Response, next: NextFunction) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return (HandleParsingError(result, next));
  }
  try {
    const { username, email, password } = req.body;
    const already = await db.select({username: users.username}).from(users).where(or(eq(users.email, email), eq(users.username, username)));
    if (already.length !== 0) {
      return next(new CustomError("Error: user already in database", 400));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const Data = await db.insert(users).values({
      username,
      email,
      password: hashedPassword
    }).returning();
    const product = await db.select().from(shop);
    if (product.length === 0)
      return next(new CustomError("Error: shop table not found in the database", 412));
    await db.insert(inventory).values(
      product.map((product) => ({
        user: Data[0].id,
        product: product.id,
        own: false,
      })));
    delete Data[0].password;
    console.log("User added",Data);
    res.status(201).json({ Data });
  } catch (error) {
    const { username } = req.body;
    const used = await db.select({username: users.username}).from(users).where(eq(users.username, username));
    if (handleErrorCode(error, next, used))
      return;
    next(new CustomError("Error: Failed to add user", 500));
  }
}

export async function getalluser(req: Request, res: Response, next: NextFunction) {
  try {
    const Data = await db.select().from(users);
    for (let i = 0; Data[i]; i++) {
      delete Data[i].password;
      delete Data[i].email;
    }
    console.log("All users",Data);
    res.status(200).json({ Data });
  } catch (error) {
    next (new CustomError("Error: Error: Failed to fetch all Users", 500));
  }
}

export async function getuserid(req: Request, res: Response, next: NextFunction) {
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
    if (Data.length === 0) {
      return next (new CustomError("Error: User not found", 404));
    }
    delete Data[0].password;
    delete Data[0].email;
    console.log("user",Data);
    res.status(200).json({ Data });
  } catch (error) {
    next (new CustomError("Error: Failed to fetch user", 500));
  }
}

export async function admingetuserid(req: Request, res: Response, next: NextFunction) {
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
      return next (new CustomError("Error: User not found", 404));
    }
    delete Data[0].password;
    console.log("user",Data);
    res.status(200).json({ Data });
  } catch (error) {
    next (new CustomError("Error: Failed to fetch user", 500));
  }
}

export async function deleteuser(req: Request, res: Response, next: NextFunction) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    console.log("Error while parsing request");
    return next(new CustomError(JSON.stringify(result.array()), 400));
  }
  try {
    const user = await db.select({id: users.id}).from(users).where(eq(users.id, +req.params.id));
    if (user.length == 0) {
      return next (new CustomError("Error: User not found", 404));
    }
    const product = await db.select().from(shop);
    await Promise.all(
      product.map(
      (product) => db.delete(inventory)
      .where(
        and(
          eq(inventory.user, user[0].id),
          eq(inventory.product, product.id)))))
    const Data = await db
      .delete(users)
      .where(eq(users.id, + req.params.id))
      .returning({
        deleteDataId: users.id,
      });
    if (Data.length == 0) {
      return next (new CustomError("Error: User not found", 404));
    }
    console.log("deleted user",Data);
    res.status(200).json({ Data });
  } catch (error) {
    next(new CustomError("Error: Failed to delete user", 500));
  }
}

export async function updateuser(req: Request, res: Response, next: NextFunction) {
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
      return next (new CustomError("Error: User not found", 404));
    }
    delete Data[0].password;
    console.log("user updated",Data);
    res.status(200).json({ Data });
  } catch (error) {
    let used = null;
    const { username } = req.body;
    if (username !== undefined){
      used = await db.select({username: users.username}).from(users).where(eq(users.username, username));
    }
    if (handleErrorCode(error, next, used))
      return;
    next(new CustomError("Error: Failed to update user", 500));
  }
}

export async function P_updateuser(req: Request, res: Response,next: NextFunction) {
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
      return next (new CustomError("Error: User not found", 404));
    }
    delete Data[0].password;
    console.log("user updated",Data);
    res.status(201).json({ Data });
  } catch (error) {
    let used = null;
    const { username } = req.body;
    if (username !== undefined && username !== null && username !== "") {
      used = await db.select({username: users.username}).from(users).where(eq(users.username, username));
    }
    if (handleErrorCode(error, next, used))
      return;
    next(new CustomError("Error: Failed to update user", 500));
  }
}