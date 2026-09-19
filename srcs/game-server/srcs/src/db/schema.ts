import { sql } from "drizzle-orm";
import { pgTable, serial, varchar, text, integer, timestamp, check, primaryKey, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: serial().primaryKey(),
	username: varchar({ length:128 }).notNull().unique(),
	email: varchar({ length:128 }).notNull().unique(),
	password: text().notNull(),
	privateAcc: boolean().notNull().default(false),
	wins: integer().default(0),
	losses: integer().default(0),
	matches: integer().default(0),
	wallet: integer().default(0),
	icon: varchar({ length:128 }),
	code: boolean().default(false),
	skin_rac: integer().default(null).references(() => shop.id),
	skin_ball: integer().default(null).references(() => shop.id),
	online_status: boolean().default(false),
});

export const friends = pgTable('friends', {
	user1: integer().notNull().references(() => users.id),
	user2: integer().notNull().references(() => users.id),
	isaccepted: boolean().default(false)
	}, (table) => [
 	primaryKey({ columns: [table.user1, table.user2] })
]);

export const matches = pgTable('matches', {
	id: serial().primaryKey(),
	user1: integer().notNull().references(() => users.id),
	user1Pseudo: varchar({ length:128 }).notNull(),
	user1EloChange: integer().notNull(),
	user2: integer().notNull().references(() => users.id),
	user2Pseudo: varchar({ length:128 }).notNull(),
	user2EloChange: integer().notNull(),
	user1Score: integer('user1_score').default(0),
	user2Score: integer('user2_score').default(0),
	idBall1: integer().default(null).references(() => shop.id),
	idBall2: integer().default(null).references(() => shop.id),
	skinRac1: integer().default(null).references(() => shop.id),
	skinRac2: integer().default(null).references(() => shop.id),
	date: timestamp().defaultNow(),
	winner: integer().notNull().references(() => users.id),
	}, (table) => [
    check("winner_check", sql`${table.winner} = ${table.user1} or ${table.winner} = ${table.user2}`)
]);

export const inventory = pgTable('inventory', {
	user: integer().notNull().references(() => users.id),
	product: integer().notNull().references(() => shop.id),
	own: boolean().notNull().default(false),
	},
	(table) => [
  	  primaryKey({
    	  columns: [table.user, table.product],
		}),
	],
);

export const shop = pgTable('shop', {
	id: serial().primaryKey(),
	name: varchar({ length:128 }).notNull(),
	price: integer().notNull().default(0),
});

export const api_users = pgTable('api_users', {
	user: integer().primaryKey().notNull().references(() => users.id),
	role: varchar({ length:128 }).notNull().default("user"),
	secret_key: varchar({ length:64 })
});

export const chat = pgTable("chat", {
	id: serial().primaryKey(),
	content: text().notNull(),
	author: integer().notNull().references(() => users.id),
	dest: integer().notNull().references(() => users.id),
	timestamp: timestamp().defaultNow().notNull(),
	}, (table) => [
    check("self_chat_check", sql`${table.author} != ${table.dest}`)
]);