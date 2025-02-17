import { relations } from "drizzle-orm";
import {
  type AnyPgColumn,
  integer,
  pgTableCreator,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `genealogy_app_${name}`);

export const families = createTable("family", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  head_id: integer("head_id").notNull(),
  updated_at: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date().toDateString()),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const members = createTable("member", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  family_id: integer("family_id").notNull(),
  generation: integer("generation").notNull().default(1),
  gender: text("gender").notNull(),
  father_id: integer("father_id").references((): AnyPgColumn => members.id),
  mother_id: integer("mother_id").references((): AnyPgColumn => members.id),
  spouse_id: integer("spouse_id").references((): AnyPgColumn => members.id),
  updated_at: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date().toDateString()),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const MemberRelations = relations(members, ({ one }) => ({
  family: one(families, {
    fields: [members.family_id],
    references: [families.id],
  }),
  father: one(members, {
    fields: [members.father_id],
    references: [members.id],
  }),
  mother: one(members, {
    fields: [members.mother_id],
    references: [members.id],
  }),
  spouse: one(members, {
    fields: [members.spouse_id],
    references: [members.id],
  }),
}));

export type FamilyType = typeof families.$inferSelect;
export type FamilyInsertType = typeof families.$inferInsert;
export type MemberType = typeof members.$inferSelect;
