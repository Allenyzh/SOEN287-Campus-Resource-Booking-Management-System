import { sql } from "drizzle-orm";
import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";

// Enum values as constants
export const USER_ROLES = ["user", "admin"] as const;
export const RESOURCE_STATUSES = ["available", "unavailable"] as const;
export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "cancelled",
  "rejected",
] as const;
export const NOTIFICATION_TYPES = ["booking_update", "announcement"] as const;

// Users table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: USER_ROLES }).notNull().default("user"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Resource categories table
export const resourceCategories = sqliteTable("resource_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  description: text("description"),
});

// Resources table
export const resources = sqliteTable("resources", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  categoryId: integer("category_id")
    .notNull()
    .references(() => resourceCategories.id),
  location: text("location"),
  capacity: integer("capacity"),
  imageUrl: text("image_url"),
  status: text("status", { enum: RESOURCE_STATUSES })
    .notNull()
    .default("available"),
  requiresApproval: integer("requires_approval", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Bookings table
export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  resourceId: integer("resource_id")
    .notNull()
    .references(() => resources.id),
  startTime: integer("start_time", { mode: "timestamp" }).notNull(),
  endTime: integer("end_time", { mode: "timestamp" }).notNull(),
  purpose: text("purpose"),
  status: text("status", { enum: BOOKING_STATUSES })
    .notNull()
    .default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Availability rules table (recurring weekly)
export const availabilityRules = sqliteTable("availability_rules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  resourceId: integer("resource_id")
    .notNull()
    .references(() => resources.id),
  dayOfWeek: integer("day_of_week").notNull(), // 0=Sunday, 1=Monday, ..., 6=Saturday
  openTime: text("open_time").notNull(), // Format: "HH:mm"
  closeTime: text("close_time").notNull(), // Format: "HH:mm"
});

// Availability exceptions table (one-off changes)
export const availabilityExceptions = sqliteTable("availability_exceptions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  resourceId: integer("resource_id")
    .notNull()
    .references(() => resources.id),
  startDatetime: integer("start_datetime", { mode: "timestamp" }).notNull(),
  endDatetime: integer("end_datetime", { mode: "timestamp" }).notNull(),
  isUnavailable: integer("is_unavailable", { mode: "boolean" })
    .notNull()
    .default(true),
  reason: text("reason"),
});

// Notifications table
export const notifications = sqliteTable("notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
  type: text("type", { enum: NOTIFICATION_TYPES }).notNull(),
  relatedBookingId: integer("related_booking_id").references(() => bookings.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Type exports for use in application
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type ResourceCategory = typeof resourceCategories.$inferSelect;
export type NewResourceCategory = typeof resourceCategories.$inferInsert;

export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;

export type AvailabilityRule = typeof availabilityRules.$inferSelect;
export type NewAvailabilityRule = typeof availabilityRules.$inferInsert;

export type AvailabilityException = typeof availabilityExceptions.$inferSelect;
export type NewAvailabilityException =
  typeof availabilityExceptions.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
