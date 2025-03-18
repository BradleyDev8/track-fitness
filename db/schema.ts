import { pgTable, varchar, uuid, timestamp } from "drizzle-orm/pg-core";


export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", {length: 255}).notNull().unique(),
    password: varchar("password", {length: 255}).notNull(),
    firstName: varchar("first_name", {length: 255}).notNull().default(''),
    lastName: varchar("last_name", {length: 255}).notNull().default(''),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});
