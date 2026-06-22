#!/usr/bin/env bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	\c "$POSTGRES_DB"

	CREATE TABLE "users" (
		"id" serial PRIMARY KEY NOT NULL,
		"username" varchar(128) NOT NULL,
		"email" varchar(128) NOT NULL,
		"password" text NOT NULL,
		"wins" integer DEFAULT 0,
		"losses" integer DEFAULT 0,
		"matches" integer DEFAULT 0,
		"wallet" integer DEFAULT 0,
		CONSTRAINT "users_username_unique" UNIQUE("username"),
		CONSTRAINT "users_email_unique" UNIQUE("email")
	);

	CREATE TABLE "api_users" (
		"user" integer NOT NULL,
		"role" varchar(128) DEFAULT 'user' NOT NULL,
		CONSTRAINT "api_users_user_unique" UNIQUE("user")
	);

	CREATE TABLE "friends" (
		"user1" integer NOT NULL,
		"user2" integer NOT NULL,
		"isaccepted" boolean DEFAULT false,
		CONSTRAINT "friends_user1_user2_pk" PRIMARY KEY("user1","user2")
	);

	CREATE TABLE "matches" (
		"id" serial PRIMARY KEY NOT NULL,
		"user1" integer NOT NULL,
		"user2" integer NOT NULL,
		"user1_score" integer DEFAULT 0,
		"user2_score" integer DEFAULT 0,
		"date" timestamp DEFAULT now(),
		"winner" integer NOT NULL,
		CONSTRAINT "winner_check" CHECK ("matches"."winner" = "matches"."user1" or "matches"."winner" = "matches"."user2")
	);

	ALTER TABLE "api_users" ADD CONSTRAINT "api_users_user_users_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
	ALTER TABLE "friends" ADD CONSTRAINT "friends_user1_users_id_fk" FOREIGN KEY ("user1") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
	ALTER TABLE "friends" ADD CONSTRAINT "friends_user2_users_id_fk" FOREIGN KEY ("user2") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
	ALTER TABLE "matches" ADD CONSTRAINT "matches_user1_users_id_fk" FOREIGN KEY ("user1") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
	ALTER TABLE "matches" ADD CONSTRAINT "matches_user2_users_id_fk" FOREIGN KEY ("user2") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;

	INSERT INTO users (username, email, password) VALUES ('$ADMIN_USERNAME', '$ADMIN_EMAIL', '$ADMIN_PASSWORD');
EOSQL
