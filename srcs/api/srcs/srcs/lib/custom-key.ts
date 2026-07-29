import { randomBytes } from "crypto";

export function generateHexString(): string {
  return randomBytes(32).toString("hex"); // 32 bytes = 64 hex chars
}