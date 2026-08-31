import { randomBytes } from "crypto";
export function generateHexString() {
    return randomBytes(32).toString("hex"); // 32 bytes = 64 hex chars
}
//# sourceMappingURL=custom-key.js.map