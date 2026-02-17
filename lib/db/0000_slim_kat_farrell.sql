-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "vagas" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" text,
	"source" text NOT NULL,
	"title" text NOT NULL,
	"location" text,
	"company" text,
	"salary" text,
	"salary_min" numeric,
	"salary_max" numeric,
	"salary_period" text,
	"job_type" text,
	"specialty" text,
	"description" text,
	"benefits" jsonb,
	"url" text,
	"raw_html" text,
	"published_at" timestamp with time zone,
	"first_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"crawled_at" timestamp with time zone DEFAULT now() NOT NULL,
	"crawler_version" text,
	"city" text,
	"state" text,
	CONSTRAINT "vagas_source_external_id_key" UNIQUE("external_id","source")
);
--> statement-breakpoint
ALTER TABLE "vagas" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "discarded_ids" (
	"source" text NOT NULL,
	"external_id" text NOT NULL,
	"reason" text,
	"discarded_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "discarded_ids_pkey" PRIMARY KEY("source","external_id")
);
--> statement-breakpoint
ALTER TABLE "discarded_ids" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE VIEW "public"."vagas_public" WITH (security_invoker = true) AS (SELECT id, external_id, source, title, location, company, salary, salary_min, salary_max, salary_period, job_type, specialty, city, state, description, benefits, url, published_at, first_seen_at, COALESCE(published_at, first_seen_at) AS effective_date FROM vagas);--> statement-breakpoint
CREATE POLICY "vagas_all_service" ON "vagas" AS PERMISSIVE FOR ALL TO "service_role" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "vagas_select_public" ON "vagas" AS PERMISSIVE FOR SELECT TO "anon";--> statement-breakpoint
CREATE POLICY "discarded_all_service" ON "discarded_ids" AS PERMISSIVE FOR ALL TO "service_role" USING (true) WITH CHECK (true);
*/