import express, { urlencoded, json } from "express";
import dotenv from "dotenv";
import { notFound } from "./middleware/not-found.ts";
import { error } from "./middleware/error.ts";
import dataRouter from "./routes/data.ts";
const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());

app.use("/api", dataRouter);

app.use(notFound);
app.use(error);

export default app;