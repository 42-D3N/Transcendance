import { CustomError } from "../lib/custom-error.ts";
import type { NextFunction } from "express";

export function HandleParsingError(result, next: NextFunction)
{
  const errors = result.array();
  if (errors.length > 1){
    if (errors[0].path === errors[1].path) {
      switch (errors[0].path) {
        case "username":
          return next (new CustomError("Error: Username not in request", 400));
        case "email":
          return next (new CustomError("Error: Email not in request", 400));
        case "password":
          return next (new CustomError("Error: Password not in request", 400));
      }
    }
  }
  switch (errors[0].path) {
    case "username":
      return next (new CustomError("Error: Invalid username", 400));
    case "email":
      return next (new CustomError("Error: Invalid Email", 400));
    case "password":
      return next (new CustomError("Error: Invalid password", 400));
  }
  return next (new CustomError(JSON.stringify(result.array()), 400));
}

export function handleErrorCode(error, next: NextFunction, used)
{
  if (!used) {
    if (error.cause.code == "42601") {
      next(new CustomError("Error: No valid field in request", 400));
      return 1;
    }
    next(new CustomError("Error: user not existing in database", 400));
    return 1;
  }
  if (!error || !error.cause || !error.cause.error)
    return 0;
  if (error.cause.code == "42601") {
    next(new CustomError("Error: No valid field in request", 400));
    return 1;
  }
  if (error.cause.code == "23505") {
    if (!used[0]) {
      next(new CustomError("Error: email already exist", 400));
    }
    else {
      next(new CustomError("Error: Username already exist", 400));
    }
    return 1;
  }
  if (error.cause.code == "23503") {
    next(new CustomError("Error: User not found in the data base", 404));
    return 1;
  }
}