import { pgTable, varchar, uuid, timestamp, date, integer, boolean } from "drizzle-orm/pg-core";


export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", {length: 255}).notNull().unique(),
    password: varchar("password", {length: 255}).notNull(),
    firstName: varchar("first_name", {length: 255}).notNull().default(''),
    lastName: varchar("last_name", {length: 255}).notNull().default(''),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const workoutTypes = pgTable("workout_types", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", {length: 100}).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const workouts = pgTable("workouts", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id),
    date: date("date").notNull(),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    duration: integer("duration").notNull(),
    caloriesBurned: integer("calories_burned").notNull(),
    workoutTypeId: uuid("workout_type_id").references(() => workoutTypes.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const dailyWorkoutLog = pgTable("daily_workout_log", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id),
    date: date("date").notNull(),
    hasWorkout: boolean("has_workout").notNull().default(false),
    intensityLevel: integer("intensity_level").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const exerciseSessions = pgTable("exercise_sessions", {
    id: uuid("id").primaryKey().defaultRandom(),
    workoutId: uuid("workout_id").notNull().references(() => workouts.id),
    exerciseName: varchar("exercise_name", {length: 100}).notNull(),
    sets: integer("sets"),
    reps: integer("reps"),
    weight: integer("weight"),
    duration: integer("duration"),
    distance: integer("distance"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});
