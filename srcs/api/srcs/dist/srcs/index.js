import { eq } from "drizzle-orm";
import app from "./server.js";
import { db } from "./db/db.js";
import { api_users, users } from "./db/schema.js";
import bcrypt, { hashSync } from "bcryptjs";
import { generateHexString } from "./lib/custom-key.js";
const port = process.env.PORT || 9090;
async function addadmin() {
    try {
        const adminUsername = process.env.ADMIN_USERNAME ?? "";
        const adminEmail = process.env.ADMIN_EMAIL ?? "";
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD ?? "", 10);
        const is_first = await db.select().from(users).where(eq(users.username, adminUsername));
        if (is_first[0])
            return (0);
        const admin = await db.insert(users).values({
            username: adminUsername,
            email: adminEmail,
            password: hashedPassword
        }).returning();
        console.log("Successfully added admin user.");
        const id = await db.select({ id: users.id }).from(users).where(eq(users.email, adminEmail));
        const secret_key = generateHexString();
        const admin_api = await db.insert(api_users).values({
            user: id[0].id,
            role: "admin",
            secret_key: secret_key
        }).returning();
        console.log("Successfully added admin user to api.");
    }
    catch (error) {
        console.log("Failed to add user ", error.cause.code);
        return (1);
    }
    return (0);
}
async function startup() {
    var ret = 0;
    if (!process.env.ADMIN_USERNAME) {
        console.log("FATAL: Missing ADMIN_USER environment variable.");
        ret = 1;
    }
    if (!process.env.ADMIN_EMAIL) {
        console.log("FATAL: Missing ADMIN_EMAIL environment variable.");
        ret = 1;
    }
    if (!process.env.ADMIN_PASSWORD) {
        console.log("FATAL: Missing ADMIN_PASSWORD environment variable.");
        ret = 1;
    }
    if (ret === 1)
        return;
    ret = await addadmin();
    if (ret === 1)
        return;
    app.listen(port, () => {
        console.log(`Server is listening at port ${port}`);
    });
}
startup();
//# sourceMappingURL=index.js.map