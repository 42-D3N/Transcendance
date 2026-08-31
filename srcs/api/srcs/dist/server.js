import express, { urlencoded, json } from "express";
import dotenv from "dotenv";
import { notFound } from "./middleware/not-found.js";
import { error } from "./middleware/error.js";
import dataRouter from "./routes/data.js";
const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());
app.use("/api", dataRouter);
app.use(notFound);
app.use(error);
export default app;
//# sourceMappingURL=server.js.map