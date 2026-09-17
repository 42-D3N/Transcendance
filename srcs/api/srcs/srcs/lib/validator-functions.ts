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
  return body("email").optional({ checkFalsy: true }).isString().trim().isEmail().normalizeEmail().custom((email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
}

function validateUpdateUsername() {
  return body("username").optional({ checkFalsy: true }).isString().trim().escape().custom((username: string) => /^[a-zA-Z0-9_-]{4,128}$/.test(username));;
}

function validateUpdatePassword() {
  return body("password").optional({ checkFalsy: true }).isString().trim().custom((password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[^\s]{12,67}$/.test(password));;
}

export function validateUpdateUser() {
  return [
    validateUpdateUsername(),
    validateUpdateEmail(),
    validateUpdatePassword()
  ];
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

export function validateDeleteFriends() {
  return [
    validateUser1(),
    validateUser2(),
  ];
}

export function validateIdFriends() {
  return [
    validateUser1(),
    validateUser2(),
    validateAccepted()
  ];
}

export function validateIdParam() {
  return param("id").toInt().isInt();
}

export function validateUsername() {
  return body("username").notEmpty().isString().trim().custom((username: string) => /^[a-zA-Z0-9_-]{4,128}$/.test(username));
}

export function validateEmail() {
  return body("email").notEmpty().isString().trim().escape().isEmail().normalizeEmail().custom((email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));;
}

export function validatePassword() {
  return body("password").notEmpty().isString().trim().custom((password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[^\s]{12,67}$/.test(password));
}

export function validateInvUser() {
  return body("user").toInt().isInt();
}

export function validateInvItem() {
  return body("item").toInt().isInt();
}

export function validateInvOwn() {
  return body("own").isBoolean().toBoolean();
}
