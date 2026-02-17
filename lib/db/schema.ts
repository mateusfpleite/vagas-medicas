import { pgTable, unique, pgPolicy, serial, text, numeric, jsonb, timestamp, primaryKey, pgView, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const vagas = pgTable("vagas", {
	id: serial().primaryKey().notNull(),
	externalId: text("external_id"),
	source: text().notNull(),
	title: text().notNull(),
	location: text(),
	company: text(),
	salary: text(),
	salaryMin: numeric("salary_min"),
	salaryMax: numeric("salary_max"),
	salaryPeriod: text("salary_period"),
	jobType: text("job_type"),
	specialty: text(),
	description: text(),
	benefits: jsonb(),
	url: text(),
	rawHtml: text("raw_html"),
	publishedAt: timestamp("published_at", { withTimezone: true, mode: 'string' }),
	firstSeenAt: timestamp("first_seen_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	crawledAt: timestamp("crawled_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	crawlerVersion: text("crawler_version"),
	city: text(),
	state: text(),
}, (table) => [
	unique("vagas_source_external_id_key").on(table.externalId, table.source),
	pgPolicy("vagas_all_service", { as: "permissive", for: "all", to: ["service_role"], using: sql`true`, withCheck: sql`true`  }),
	pgPolicy("vagas_select_public", { as: "permissive", for: "select", to: ["anon"] }),
]);

export const discardedIds = pgTable("discarded_ids", {
	source: text().notNull(),
	externalId: text("external_id").notNull(),
	reason: text(),
	discardedAt: timestamp("discarded_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	primaryKey({ columns: [table.source, table.externalId], name: "discarded_ids_pkey"}),
	pgPolicy("discarded_all_service", { as: "permissive", for: "all", to: ["service_role"], using: sql`true`, withCheck: sql`true`  }),
]);
export const vagasPublic = pgView("vagas_public", {	id: integer(),
	externalId: text("external_id"),
	source: text(),
	title: text(),
	location: text(),
	company: text(),
	salary: text(),
	salaryMin: numeric("salary_min"),
	salaryMax: numeric("salary_max"),
	salaryPeriod: text("salary_period"),
	jobType: text("job_type"),
	specialty: text(),
	city: text(),
	state: text(),
	description: text(),
	benefits: jsonb(),
	url: text(),
	publishedAt: timestamp("published_at", { withTimezone: true, mode: 'string' }),
	firstSeenAt: timestamp("first_seen_at", { withTimezone: true, mode: 'string' }),
	effectiveDate: timestamp("effective_date", { withTimezone: true, mode: 'string' }),
}).with({"securityInvoker":true}).as(sql`SELECT id, external_id, source, title, location, company, salary, salary_min, salary_max, salary_period, job_type, specialty, city, state, description, benefits, url, published_at, first_seen_at, COALESCE(published_at, first_seen_at) AS effective_date FROM vagas`);