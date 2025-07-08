import {
	boolean,
	index,
	integer,
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

// Define the 'scheduleAvailabilities' table to link schedules with events
export const ScheduleAvailabilities = pgTable(
	"scheduleAvailabilities", // table name in the database
	{
		id: uuid("id").primaryKey().defaultRandom(), // Unique identifier for each availability, auto-generated
		scheduleId: uuid("scheduleId") // Foreign key referencing the schedule
			.notNull()
			.references(() => ScheduleTable.id, { onDelete: "cascade" }), // Ensures that if a schedule is deleted, its availabilities are also deleted
		eventId: uuid("eventId") // Foreign key referencing the event
			.notNull()
			.references(() => EventTable.id, { onDelete: "cascade" }), // Ensures that if an event is deleted, its availabilities are also deleted
		createAt,
		updateAt,
	}
);
