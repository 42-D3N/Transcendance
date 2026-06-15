import { body, param } from "express-validator";

//Validating and sanitizing title from request body
export function validateDataTitle() {
  return body("title").notEmpty().isString().trim().escape();
}

//Validating and sanitizing body from request body
export function validateDataBody() {
  return body("body").notEmpty().isString().trim().escape();
}

//Validating id from route parameter
export function validateIdParam() {
  return param("id").toInt().isInt();
}


