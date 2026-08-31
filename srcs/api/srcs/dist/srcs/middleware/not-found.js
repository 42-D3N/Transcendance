import express from "express";
import { CustomError } from "../lib/custom-error.js";
export function notFound(req, res, next) {
    return next(new CustomError("Route not found", 404));
}
//# sourceMappingURL=not-found.js.map