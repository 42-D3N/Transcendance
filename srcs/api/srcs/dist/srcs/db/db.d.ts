import postgres from 'postgres';
import * as schema from './schema.ts';
import 'dotenv/config';
export declare const db: import("drizzle-orm/postgres-js").PostgresJsDatabase<typeof schema> & {
    $client: postgres.Sql<{}>;
};
//# sourceMappingURL=db.d.ts.map