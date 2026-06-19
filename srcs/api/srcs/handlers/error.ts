import { CustomError } from "../lib/custom-error.ts";
import type { NextFunction } from "express";

export function HandleParsingError(result, next: NextFunction)
{
  const errors = result.array();
  if (errors.length > 1){
    if (errors[0].path === errors[1].path) {
      switch (errors[0].path) {
        case "username":
          console.log("Username not in request");
          return next (new CustomError("Username not in request", 400));
        case "email":
          console.log("Email not in request");
          return next (new CustomError("Email not in request", 400));
        case "password":
          console.log("Password not in request");
          return next (new CustomError("Password not in request", 400));
      }
    }
  }
  switch (errors[0].path) {
    case "username":
      console.log("Invalid username");
      return next (new CustomError("Invalid username", 400));
    case "email":
      console.log("Invalid email");
      return next (new CustomError("Invalid Email", 400));
    case "password":
      console.log("Invalid password");
      return next (new CustomError("Invalid password", 400));
  }
  console.log("Error while parsing request");
  return next (new CustomError(JSON.stringify(result.array()), 400));
}

export function handleErrorCode(error, next: NextFunction, used)
{
  if (error.cause.code == "42601") {
    console.log("No valid field in request");
    next(new CustomError("No valid field in request", 400));
    return 1;
  }
  if (error.cause.code == "23505") {
    if (!used[0]) {
      console.log("Email already exist");
      next(new CustomError("Email already exist", 400));
    }
    else {
      console.log("Username already exist");
      next(new CustomError("Username already exist", 400));
    }
    return 1;
  }
  if (error.cause.code == "23503") {
    console.log("User not found in the data base");
    next(new CustomError("User not found in the data base", 404));
    return 1;
  }
}