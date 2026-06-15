import express from "express";

import { eq } from "drizzle-orm";
import { db } from "../db/db.ts";
import { DataTable } from "../db/schema.ts";
import type { Response, Request, NextFunction } from "express";
import { CustomError } from "../lib/custom-error.ts";
import { validationResult } from "express-validator";

export async function addData(req: Request, res: Response, next: NextFunction) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next(new CustomError(JSON.stringify(result.array()), 400));
  }
  try {
    const Data = await db.insert(DataTable).values(req.body).returning();
    res.status(201).json({ Data });
  } catch (error) {
    next(new CustomError("Failed to add Data", 500));
  }
}

export async function getAllData(req: Request, res: Response, next: NextFunction) {
  try {
    const Data = await db.select().from(DataTable);
    res.status(200).json({ Data });
  } catch (error) {
    next(new CustomError("Failed to fetch Data", 500));
  }
}

export async function getData(req: Request, res: Response, next: NextFunction) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next(new CustomError(JSON.stringify(result.array()), 400));
  }
  try {
    const Data = await db
      .select()
      .from(DataTable)
      .where(eq(DataTable.id, +req.params.id));
    res.status(200).json({ Data });
  } catch (error) {
    next(new CustomError("Failed to fetch Data", 500));
  }
}

export async function deleteData(req: Request, res: Response, next: NextFunction) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next(new CustomError(JSON.stringify(result.array()), 400));
  }
  try {
    const Data = await db
      .delete(DataTable)
      .where(eq(DataTable.id, +req.params.id))
      .returning({
        deletedDataId: DataTable.id,
      });
    res.status(200).json({ Data });
  } catch (error) {
    next(new CustomError("Failed to delete Data", 500));
  }
}

export async function updateData(req: Request, res: Response,next: NextFunction) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next(new CustomError(JSON.stringify(result.array()), 400));
  }
  try {
    const Data = await db
      .update(DataTable)
      .set(req.body)
      .where(eq(DataTable.id, +req.params.id))
      .returning();

    res.status(201).json({ Data });
  } catch (error) {
    next(new CustomError("Failed to update Data", 500));
  }
}


