import type { Response, Request, NextFunction } from "express";

export async function healthCheck(_req:Request, res:Response, _next:NextFunction) {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now()
    };
    try {
        res.send(healthcheck);
    } catch (err) {
        healthcheck.message = err;
        res.status(503).send();
    }
}