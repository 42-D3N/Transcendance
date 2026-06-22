import { eq } from "drizzle-orm";
import { db } from "../db/db.ts";
import { users } from "../db/schema.ts";
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
    const hashedPassword = await bcrypt.hash(password, 10);
    const Data = await db.insert(users).values({
      username,
      email,
      password: hashedPassword
    }).returning();
    delete Data[0].password;
    console.log("User added",Data);
    res.status(201).json({ Data });
  } catch (error) {
    const { username } = req.body;
    const used = await db.select({username: users.username}).from(users).where(eq(username, users.username));
    if (handleErrorCode(error, next, used))
      return;
    console.log("Failed to add user ", error.cause.code);
    next(new CustomError("Failed to add user", 500));
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
    console.log("Failed to fetch all users ", error.cause.code);
    next (new CustomError("Failed to fetch all Users", 500));
  }
}

export async function getuserid(req: Request, res: Response, next: NextFunction) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    console.log("Error while parsing request");
    return next(new CustomError(JSON.stringify(result.array()), 400));
  }
  try {
    const Data = await db
      .select()
      .from(users)
      .where(eq(users.id, + req.params.id));
    if (Data.length == 0) {
      console.log("User not found");
      return next (new CustomError("User not found", 404));
    }
    delete Data[0].password;
    delete Data[0].email;
    console.log("user",Data);
    res.status(200).json({ Data });
  } catch (error) {
    console.log("Failed to fetch user ", error.cause.error);
    next (new CustomError("Failed to fetch user", 500));
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
      .where(eq(users.id, + req.params.id));
    if (Data.length == 0) {
      console.log("User not found");
      return next (new CustomError("User not found", 404));
    }
    delete Data[0].password;
    console.log("user",Data);
    res.status(200).json({ Data });
  } catch (error) {
    console.log("Failed to fetch user ", error.cause.error);
    next (new CustomError("Failed to fetch user", 500));
  }
}

export async function deleteuser(req: Request, res: Response, next: NextFunction) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    console.log("Error while parsing request");
    return next(new CustomError(JSON.stringify(result.array()), 400));
  }
  try {
    const Data = await db
      .delete(users)
      .where(eq(users.id, + req.params.id))
      .returning({
        deleteDataId: users.id,
      });
    if (Data.length == 0) {
      console.log("User not found");
      return next (new CustomError("User not found", 404));
    }
    console.log("deleted user",Data);
    res.status(200).json({ Data });
  } catch (error) {
    console.log("Failed to delete user ", error.cause.error);
    next(new CustomError("Failed to delete user", 500));
  }
}

export async function updateuser(req: Request, res: Response, next: NextFunction) {
  console.log("BODY RECEIVED:", req.body);
  const result = validationResult(req);
  console.log("VALIDATION RESULT:", result.array());
  if (!result.isEmpty()) {
    console.log("Error while parsing request");
    return (HandleParsingError(result, next));
  }
  try {
    const update_data = { ...req.body };
    console.log(update_data);
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
      return next (new CustomError("User not found", 404));
    }
    delete Data[0].password;
    console.log("user updated",Data);
    res.status(200).json({ Data });
  } catch (error) {
    const { username } = req.body;
    const used = await db.select({username: users.username}).from(users).where(eq(username, users.username));
    if (handleErrorCode(error, next, used))
      return;
    console.log("Failed to update user ", error.cause.code);
    next(new CustomError("Failed to update user", 500));
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
      console.log("User not found");
      return next (new CustomError("User not found", 404));
    }
    delete Data[0].password;
    console.log("user updated",Data);
    res.status(201).json({ Data });
  } catch (error) {
    const { username } = req.body;
    const used = await db.select({username: users.username}).from(users).where(eq(username, users.username));
    if (handleErrorCode(error, next, used))
      return;
    console.log("Failed to update user ", error.cause.code);
    next(new CustomError("Failed to update Data", 500));
  }
}