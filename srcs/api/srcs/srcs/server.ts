import express, { urlencoded, json } from "express";
import { rateLimit } from 'express-rate-limit'
import dotenv from "dotenv";
import { notFound } from "./middleware/not-found.ts";
import { error } from "./middleware/error.ts";
import dataRouter from "./routes/data.ts";
import { CustomError } from "./lib/custom-error.ts";

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    handler: (req, res, next) =>
        next (new CustomError(`Error: limit rate hit\nlimit are 120 request over 1 min`, 400))
})

const app = express();

app.set("trust proxy", 1);
app.use(limiter);
app.use(urlencoded({ extended: true }));
app.use(json());

app.use("/api", dataRouter);

app.use(notFound);
app.use(error);

export default app;