import { CustomError } from "../lib/custom-error.ts";
import type { NextFunction } from "express";

export function HandleError(result, next: NextFunction)
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
