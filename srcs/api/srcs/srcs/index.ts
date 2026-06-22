import { eq } from "drizzle-orm";
import app from "./server.ts";
import { db } from "./db/db.ts";
import { users } from "./db/schema.ts";
import bcrypt, { hashSync } from "bcryptjs";
const port = process.env.PORT || 9090;

async function addadmin():Promise<number> {
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  const is_first = await db.select().from(users).where(eq(process.env.ADMIN_USERNAME, users.username));
  if (is_first[0])
	return (0);
  try {
    const admin = await db.insert(users).values({
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword
	}).returning();
	console.log("Successfully added admin user.");
	} catch (error) {
	console.log("Failed to add user ", error.cause.code);
	return (1);
  }
  return (0);
}

async function startup()
{
	var	ret:number = 0;
	if (!process.env.ADMIN_USERNAME)
	{
		console.log("FATAL: Missing ADMIN_USER environment variable.");
		ret = 1;
	}
	if (!process.env.ADMIN_EMAIL)
	{
		console.log("FATAL: Missing ADMIN_EMAIL environment variable.");
		ret = 1;
	}
	if (!process.env.ADMIN_PASSWORD)
	{
		console.log("FATAL: Missing ADMIN_PASSWORD environment variable.");
		ret = 1;
	}
	if (ret === 1)
		return ;

	ret = await addadmin();
	if (ret === 1)
		return ;

	app.listen(port, () => {
	console.log(`Server is listening at port ${port}`);
	});
}

startup();