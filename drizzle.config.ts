import { defineConfig } from "drizzle-kit";

// Get the database URL from environment variables
const databaseUrl = process.env.DATABASE_URL;

// If the database URL is not defined, throw an error to prevent misconfiguration.
if (!databaseUrl) {
	throw new Error(
		"DATABASE_URL is not defined. Please set it in your environment variables."
	);
}

// Export the configuration for Drizzle ORM
export default defineConfig({
	// path to your schema definitions (Drizzle ORM will scan this file)
	schema: "./drizzle/schema.ts",

	// directory where Drizzle will output  migration files
	out: "./drizzle/migrations",

	// Specify which SQL dialect you're using. (e.g., PostgreSQL, MySQL, SQLite)
	dialect: "postgresql",

	// enable strict mode to enforce stricter validation and type-safety
	strict: true,

	// Enable verbose mode to log detailed information about the migration process
	verbose: true,

	// Pass in database credentials (like connection URL)
	dbCredentials: {
		url: databaseUrl, // Use the database URL defined earlier
	},
});
