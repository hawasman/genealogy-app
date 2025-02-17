CREATE TABLE IF NOT EXISTS "genealogy_app_family" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "genealogy_app_family_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text,
	"head_id" integer,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "genealogy_app_member" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "genealogy_app_member_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"family_id" integer NOT NULL,
	"generation" integer DEFAULT 1 NOT NULL,
	"gender" text NOT NULL,
	"father_id" integer,
	"mother_id" integer,
	"spouse_id" integer,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "genealogy_app_member" ADD CONSTRAINT "genealogy_app_member_father_id_genealogy_app_member_id_fk" FOREIGN KEY ("father_id") REFERENCES "public"."genealogy_app_member"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "genealogy_app_member" ADD CONSTRAINT "genealogy_app_member_mother_id_genealogy_app_member_id_fk" FOREIGN KEY ("mother_id") REFERENCES "public"."genealogy_app_member"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "genealogy_app_member" ADD CONSTRAINT "genealogy_app_member_spouse_id_genealogy_app_member_id_fk" FOREIGN KEY ("spouse_id") REFERENCES "public"."genealogy_app_member"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
