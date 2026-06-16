import type { NextFunction } from "express";
import { validateDataBody } from "./validator-functions.ts";
import { validationResult } from "express-validator";

export class CustomError extends Error {
  // message!: string;
  status: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.status = statusCode;
  }
}
