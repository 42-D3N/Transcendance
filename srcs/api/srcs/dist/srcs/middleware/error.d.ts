import type { Request, Response, NextFunction } from "express";
import { CustomError } from "../lib/custom-error.ts";
export declare function error(err: CustomError, req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=error.d.ts.map