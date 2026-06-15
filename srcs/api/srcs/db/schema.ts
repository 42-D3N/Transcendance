import { pgTable, text ,serial} from "drizzle-orm/pg-core";

export const DataTable = pgTable("data", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body"),
});
