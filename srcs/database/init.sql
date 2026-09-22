CREATE TABLE "api_users" (
	"user" integer PRIMARY KEY NOT NULL,
	"role" varchar(128) DEFAULT 'user' NOT NULL,
	"secret_key" varchar(64)
);
--> statement-breakpoint
CREATE TABLE "chat" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"author" integer NOT NULL,
	"dest" integer NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "self_chat_check" CHECK ("chat"."author" != "chat"."dest")
);
--> statement-breakpoint
CREATE TABLE "friends" (
	"user1" integer NOT NULL,
	"user2" integer NOT NULL,
	"isaccepted" boolean DEFAULT false,
	CONSTRAINT "friends_user1_user2_pk" PRIMARY KEY("user1","user2")
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"user" integer NOT NULL,
	"product" integer NOT NULL,
	"own" boolean DEFAULT false NOT NULL,
	CONSTRAINT "inventory_user_product_pk" PRIMARY KEY("user","product")
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" serial PRIMARY KEY NOT NULL,
	"user1" integer NOT NULL,
	"user1Pseudo" varchar(128) NOT NULL,
	"user1EloChange" integer NOT NULL,
	"user2" integer NOT NULL,
	"user2Pseudo" varchar(128) NOT NULL,
	"user2EloChange" integer NOT NULL,
	"user1_score" integer DEFAULT 0,
	"user2_score" integer DEFAULT 0,
	"idBall1" integer DEFAULT null,
	"idBall2" integer DEFAULT null,
	"skinRac1" integer DEFAULT null,
	"skinRac2" integer DEFAULT null,
	"date" timestamp DEFAULT now(),
	"winner" integer NOT NULL,
	CONSTRAINT "winner_check" CHECK ("matches"."winner" = "matches"."user1" or "matches"."winner" = "matches"."user2")
);
--> statement-breakpoint
CREATE TABLE "shop" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"price" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(128) NOT NULL,
	"email" varchar(128) NOT NULL,
	"password" text NOT NULL,
	"privateAcc" boolean DEFAULT false NOT NULL,
	"wins" integer DEFAULT 0,
	"losses" integer DEFAULT 0,
	"matches" integer DEFAULT 0,
	"wallet" integer DEFAULT 0,
	"icon" varchar(128),
	"code" boolean DEFAULT false,
	"skin_rac" integer DEFAULT null,
	"skin_ball" integer DEFAULT null,
	"online_status" boolean DEFAULT false,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "api_users" ADD CONSTRAINT "api_users_user_users_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_author_users_id_fk" FOREIGN KEY ("author") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_dest_users_id_fk" FOREIGN KEY ("dest") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friends" ADD CONSTRAINT "friends_user1_users_id_fk" FOREIGN KEY ("user1") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friends" ADD CONSTRAINT "friends_user2_users_id_fk" FOREIGN KEY ("user2") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_user_users_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_product_shop_id_fk" FOREIGN KEY ("product") REFERENCES "public"."shop"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_user1_users_id_fk" FOREIGN KEY ("user1") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_user2_users_id_fk" FOREIGN KEY ("user2") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_idBall1_shop_id_fk" FOREIGN KEY ("idBall1") REFERENCES "public"."shop"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_idBall2_shop_id_fk" FOREIGN KEY ("idBall2") REFERENCES "public"."shop"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_skinRac1_shop_id_fk" FOREIGN KEY ("skinRac1") REFERENCES "public"."shop"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_skinRac2_shop_id_fk" FOREIGN KEY ("skinRac2") REFERENCES "public"."shop"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_winner_users_id_fk" FOREIGN KEY ("winner") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_skin_rac_shop_id_fk" FOREIGN KEY ("skin_rac") REFERENCES "public"."shop"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_skin_ball_shop_id_fk" FOREIGN KEY ("skin_ball") REFERENCES "public"."shop"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
INSERT INTO shop (name, price) VALUES ('Product 1', 10), ('Product 2', 20), ('Product 3', 30), ('Product 4', 40), ('Product 5', 50), ('Product 6', 60), ('Product 7', 70), ('Product 8', 670);