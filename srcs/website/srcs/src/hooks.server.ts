import type { ServerInit } from '@sveltejs/kit';
import { db } from '$lib/server/db/index';
import { shop } from '$lib/server/db/schema';
import { eq, lt, gte, ne } from 'drizzle-orm';

export const init: ServerInit = async () => {
    const tmp =  await db.select({ id:shop.id}).from(shop).where(eq(shop.id, 1));
    console.log(tmp);
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
}

