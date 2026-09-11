import express, { urlencoded, json } from "express";
import { Router } from "express";
import { rateLimit } from 'express-rate-limit'
import dotenv from "dotenv";
import * as v from "./lib/validator-functions.ts";
import { register, login, deleteapiuser } from "./handlers/auth.ts";
import { notFound } from "./middleware/not-found.ts";
import { error } from "./middleware/error.ts";
import dataRouter from "./routes/data.ts";
import { CustomError } from "./lib/custom-error.ts";
import { authMiddleware } from "./middleware/auth.ts";

const publicLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    handler: (req, res, next) => next(new CustomError("Too many requests. Please try again later.",429)),
});

const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    skip: (req) => req.user?.role === "admin",
    handler: (req, res, next) => next(new CustomError("Too many requests. Please try again later.",429)),
});

const app = express();

app.set("trust proxy", 1);
app.use(urlencoded({ extended: true }));
app.use(json());

//auth
app.post("/api/register", v.validateEmail(), v.validatePassword(), publicLimiter, register);
app.post("/api/login", v.validateEmail(), v.validatePassword(), publicLimiter, login);
app.delete("/api/quit", v.validateEmail(), v.validatePassword(), publicLimiter, deleteapiuser);

app.use(authMiddleware);
app.use(apiLimiter);


app.use("/api", dataRouter);

app.use(notFound);
app.use(error);

export default app;