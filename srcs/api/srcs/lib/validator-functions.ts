import { body, param } from "express-validator";

//Validating and sanitizing title from request body
export function validateDataTitle() {
  return body("title").notEmpty().isString().trim().escape();
}

//Validating and sanitizing body from request body
export function validateDataBody() {
  return body("body").notEmpty().isString().trim().escape();
}

function validateUpdateEmail() {
  return body("email").optional().notEmpty().isString().trim().escape().isEmail();
}

function validateUpdateUsername() {
  return body("username").optional().notEmpty().isString().trim().escape();
}

function validateUpdatePassword() {
  return body("password").optional().notEmpty().isString().trim().escape();
}

function validateUser1() {
  return body("user1").notEmpty().isNumeric().trim().escape();
}

function validateUser2() {
  return body("user2").notEmpty().isNumeric().trim().escape();
}

function validateAccepted() {
  return body("isaccepted").notEmpty().trim().escape().toBoolean().isBoolean();
}

export function validateIdFriends() {
  return [
    validateUser1(),
    validateUser2(),
    validateAccepted()
  ];
}

export function validateUpdateUser() {
  return [
    validateUpdateUsername(),
    validateUpdateEmail(),
    validateUpdatePassword()
  ];
}

//Validating id from route parameter
export function validateIdParam() {
  return param("id").toInt().isInt();
}

export function validateUsername() {
  return body("username").notEmpty().isString().trim().escape();
}

export function validateEmail() {
  return body("email").notEmpty().isString().trim().escape().isEmail();
}

export function validatePassword() {
  return body("password").notEmpty().isString().trim().escape();
}