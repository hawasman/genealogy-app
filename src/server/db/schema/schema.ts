import { relations } from "drizzle-orm";
import {
  type AnyPgColumn,
  boolean,
  date,
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
  birthdate: date("birthdate", { mode: "string" }).notNull(),
  deathdate: date("deathdate", { mode: "string" }),
  notes: text("notes"),
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

export const quizzes = createTable("quiz", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const questions = createTable("question", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  quiz_id: integer("quiz_id").references(() => quizzes.id),
  question_text: text("question_text").notNull(),
  member1_id: integer("member1_id").references(() => members.id),
  member2_id: integer("member2_id").references(() => members.id),
  points: integer("points").notNull().default(1),
});

export const answers = createTable("answer", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  question_id: integer("question_id").references(() => questions.id),
  answer_text: text("answer_text").notNull(),
  is_correct: boolean("is_correct").notNull(),
});

export const QuizRelations = relations(quizzes, ({ many }) => ({
  questions: many(questions),
}));

export const QuestionRelations = relations(questions, ({ one, many }) => ({
  quiz: one(quizzes, {
    fields: [questions.quiz_id],
    references: [quizzes.id],
  }),
  member1: one(members, {
    fields: [questions.member1_id],
    references: [members.id],
  }),
  member2: one(members, {
    fields: [questions.member2_id],
    references: [members.id],
  }),
  answers: many(answers),
}));

export const AnswerRelations = relations(answers, ({ one }) => ({
  question: one(questions, {
    fields: [answers.question_id],
    references: [questions.id],
  }),
}));

export type FamilyType = typeof families.$inferSelect;
export type FamilyInsertType = typeof families.$inferInsert;
export type MemberType = typeof members.$inferSelect;
export type createMemberType = typeof members.$inferInsert;
