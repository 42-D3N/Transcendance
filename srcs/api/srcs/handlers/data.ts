import express from "express";

import { eq } from "drizzle-orm";
import { db } from "../db/db.ts";
import { users, friends, matches } from "../db/schema.js";
import type { Response, Request, NextFunction } from "express";
import { CustomError } from "../lib/custom-error.ts";
import { HandleError } from "./error.ts";
import { validationResult, type ValidationError } from "express-validator";
import { json } from "drizzle-orm/gel-core";


export async function adduser(req: Request, res: Response, next: NextFunction) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return (HandleError(result, next));
  }
  try {
    const { username, email, password } = req.body;
    const Data = await db.insert(users).values({
      username,
      email,
      password
    }).returning();
    res.status(201).json({ Data });
  } catch (error) {
    if (error.cause.code == "23505") {
      console.log("Username or email already exist");
      return next(new CustomError("Username or email already exist", 400));
    }
    next(new CustomError("Failed to add Data", 500));
  }
}

export async function getalluser(req: Request, res: Response, next: NextFunction) {
  try {
    const Data = await db.select().from(users);
    console.log(Data);
    res.status(200).json({ Data });
  } catch (error) {
    console.log("Failed to fetch all users", 500)
    next (new CustomError("Failed to fetch all Users", 500));
  }
}

export async function getuserid(req: Request, res: Response, next: NextFunction) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    console.log("Error while parsing request")
    return next(new CustomError(JSON.stringify(result.array()), 400));
  }
  try {
    const Data = await db
      .select()
      .from(users)
      .where(eq(users.id, + req.params.id));
    console.log(Data);
    res.status(200).json({ Data });
  } catch (error) {
    console.log("Failed to fetch user")
    next (new CustomError("Failed to fetch user", 500))
  }
}

// export async function getData(req: Request, res: Response, next: NextFunction) {
//   const result = validationResult(req);
//   if (!result.isEmpty()) {
//     return next(new CustomError(JSON.stringify(result.array()), 400));
//   }
//   try {
//     const Data = await db
//       .select()
//       .from(DataTable)
//       .where(eq(DataTable.id, +req.params.id));
//     res.status(200).json({ Data });
//   } catch (error) {
//     next(new CustomError("Failed to fetch Data", 500));
//   }
// }

// export async function deleteData(req: Request, res: Response, next: NextFunction) {
//   const result = validationResult(req);
//   if (!result.isEmpty()) {
//     return next(new CustomError(JSON.stringify(result.array()), 400));
//   }
//   try {
//     const Data = await db
//       .delete(DataTable)
//       .where(eq(DataTable.id, +req.params.id))
//       .returning({
//         deletedDataId: DataTable.id,
//       });
//     res.status(200).json({ Data });
//   } catch (error) {
//     next(new CustomError("Failed to delete Data", 500));
//   }
// }

// export async function updateData(req: Request, res: Response,next: NextFunction) {
//   const result = validationResult(req);
//   if (!result.isEmpty()) {
//     return next(new CustomError(JSON.stringify(result.array()), 400));
//   }
//   try {
//     const Data = await db
//       .update(DataTable)
//       .set(req.body)
//       .where(eq(DataTable.id, +req.params.id))
//       .returning();

//     res.status(201).json({ Data });
//   } catch (error) {
//     next(new CustomError("Failed to update Data", 500));
//   }
// }
