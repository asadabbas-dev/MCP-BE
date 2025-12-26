import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { config } from "dotenv";

config();

/**
 * TypeORM Configuration for PostgreSQL Database
 *
 * This configuration connects to PostgreSQL database.
 * Make sure to update .env file with your database credentials.
 */
export const typeOrmConfig = (): TypeOrmModuleOptions => ({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || "mcp_db",

  // Entity files location
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],

  // Auto-sync database schema (set to false in production)
  // Temporarily set to false to run migration manually, then set back to true
  synchronize: false, // Set to false in production and use migrations

  // Logging options
  logging: process.env.NODE_ENV === "development",

  // PostgreSQL specific options
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,

  // Migration options
  migrations: [__dirname + "/../migrations/**/*{.ts,.js}"],
  migrationsRun: true, // Run migrations automatically on startup
});
