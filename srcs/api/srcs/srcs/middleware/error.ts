import express from "express";
import type { Request, Response, NextFunction } from "express";
import { CustomError } from "../lib/custom-error.ts";

export function error(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
)
  {
  let debug:number = 1;
  console.error(err?.message);
  if (debug === 1)
    {
    console.error("==========DEBUG MODE API==========");
    console.error(err);
    console.error("Message:", err?.message);
    console.error("Stack:", err?.stack);
    console.error("Status:", err?.status);
    console.error("==========DEBUG MODE API==========");
  }
  res.status(err?.status ?? 500).json({
      msg: err?.message ?? "Internal server error"
  });
  }
