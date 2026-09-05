import { eq } from "drizzle-orm";
import app from "./server.ts";
import { db } from "./db/db.ts";
import { api_users, users, shop } from "./db/schema.ts";
import bcrypt, { hashSync } from "bcryptjs";
import { generateHexString } from "./lib/custom-key.ts";
const port = process.env.PORT || 9090;

async function addadmin():Promise<number> {
  try {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    const is_first = await db.select().from(users).where(eq(process.env.ADMIN_USERNAME, users.username));
    if (is_first[0])
      return (0);
    const admin = await db.insert(users).values({
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword
    }).returning();
    console.log("Successfully added admin user.");
    const id = await db.select({id: users.id}).from(users).where(eq(process.env.ADMIN_EMAIL, users.email));
	const secret_key = generateHexString();
    const admin_api = await db.insert(api_users).values({
      user: id[0].id,
      role: "admin",
	  secret_key: secret_key
    }).returning();
	// a delete uniquement pout des test a pas mettre en prod
	const tmp =  await db.select({ id:shop.id}).from(shop).where(eq(shop.id, 1));
	for (let i:number = 0; i !== 10; i++)
		console.log("DELETE ELEMENTS ICI SHOP INSERT")
    if(!tmp[0])
    {
        await db.insert(shop).values([
        { name: 'Product 1', price: 10, },
        { name: 'Product 2', price: 20, },
        { name: 'Product 3', price: 30, },
        { name: 'Product 4', price: 40, },
        { name: 'Product 5', price: 50, },
        { name: 'Product 6', price: 60, },
        { name: 'Product 7', price: 70, },
        { name: 'Product 8', price: 80, },
        ]);
        console.log('Products inserted!');
    }
	// a delete uniquement pout des test a pas mettre en prod
    console.log("Successfully added admin user to api.");
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