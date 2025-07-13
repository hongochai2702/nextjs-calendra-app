import { DAYS_OF_WEEK_IN_ORDER } from "@/constants";
import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

// Define a reusable timestamp column with default value set to now
const createAt = timestamp("createAt").notNull().defaultNow();
const updateAt = timestamp("updateAt")
	.notNull()
	.defaultNow()
	.$onUpdate(() => new Date()); // Automatically updates to the current timestamp on update
// Define the "events" table with fields like names, description, and duration
export const EventTable = pgTable(
	"events", // table name in the database
	{
		id: uuid("id").primaryKey().defaultRandom(), // Unique identifier for each event, auto-generated
		name: text("name").notNull(), // Name of the event, cannot be null
		description: text("description"), // Description of the event, can be null
		durationInMinutes: integer("durationInMinutes").notNull(), // Duration of the event in minutes, cannot be null
		clerkUserId: text("clerkUserId").notNull(), // Clerk user ID associated with the event, cannot be null
		isActive: boolean("isActive").notNull().default(true), // Indicates if the event is active, defaults to true
		createAt, // when the event was created
		updateAt, // When event was last updated
	},
	(table) => [
		index("clerkUserIdIndex").on(table.clerkUserId), // Index for clerkUserId to speed up queries filtering by user
	]
);

// Define the "schedules" table with fields like start time, end time, and event ID
export const ScheduleTable = pgTable(
	"schedules", // table name in the database
	{
		id: uuid("id").primaryKey().defaultRandom(), // Unique identifier for each schedule, auto-generated
		timezone: text("timezone").notNull(),
		clerkUserId: text("clerkUserId").notNull(),
		createAt,
		updateAt,
	}
);

// Define relationships for the ScheduleTable: a schedule has many availabilities.
export const scheduleRelations = relations(ScheduleTable, ({ many }) => ({
	availabilities: many(ScheduleAvailabilitiesTable), // one-to-many relation with ScheduleAvailabilities
}));

// Define a PostgreSQL enum for the days of the week
export const scheduleDayOfWeekEnum = pgEnum("day", DAYS_OF_WEEK_IN_ORDER);

// Define the 'scheduleAvailabilities' table to link schedules with events
export const ScheduleAvailabilitiesTable = pgTable(
	"scheduleAvailabilities", // table name in the database
	{
		id: uuid("id").primaryKey().defaultRandom(), // Unique identifier for each availability, auto-generated
		scheduleId: uuid("scheduleId") // Foreign key referencing the schedule
			.notNull()
			.references(() => ScheduleTable.id, { onDelete: "cascade" }), // Ensures that if a schedule is deleted, its availabilities are also deleted
		startTime: text("startTime").notNull(), // Start time of the availability, cannot be null
		endTime: text("endTime").notNull(), // End time of the availability, cannot be null
		dayOfWeek: scheduleDayOfWeekEnum("dayOfWeek").notNull(), // Day of the week for the availability, cannot be null
		createAt,
		updateAt,
	},
	(table) => [index("scheduleIdIndex").on(table.scheduleId)]
);

// Define  the reverse relation: each availability belongs to a schedule.
export const ScheduleAvailabilitiesRelations = relations(
	ScheduleAvailabilitiesTable,
	({ one }) => ({
		schedule: one(ScheduleTable, {
			fields: [ScheduleAvailabilitiesTable.scheduleId], // local key
			references: [ScheduleTable.id], // foreign key
		}),
	})
);
