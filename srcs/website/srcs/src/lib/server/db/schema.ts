import { sql } from "drizzle-orm";
import { pgTable, serial, varchar, text, integer, timestamp, check, primaryKey } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: serial().primaryKey(),
	username: varchar({ length:128 }).notNull().unique(),
	email: varchar({ length:128 }).notNull().unique(),
	password: varchar({ length:64 }).notNull(),
	friends: text().default(""),
	wins: integer().default(0),
	losses: integer().default(0),
	matches: integer().default(0),
	wallet: integer().default(0)
});

export const friends = pgTable('friends', {
	user1: integer().notNull().references(() => users.id),
	user2: integer().notNull().references(() => users.id)
	}, (table) => [
 	primaryKey({ columns: [table.user1, table.user2] })
]);

export const matches = pgTable('matches', {
	id: serial().primaryKey(),
	user1: integer().notNull().references(() => users.id),
	user2: integer().notNull().references(() => users.id),
	user1Score: integer('user1_score').default(0),
	user12core: integer('user2_score').default(0),
	date: timestamp().defaultNow(),
	winner: integer().notNull()
	}, (table) => [
    check("winner_check", sql`${table.winner} = ${table.user1} or ${table.winner} = ${table.user2}`)
]);