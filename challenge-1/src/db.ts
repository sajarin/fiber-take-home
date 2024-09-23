import knex, { Knex } from "knex";
import { schemas } from "./schemas";
import chalk from "chalk";
import * as fs from "fs-extra";
import {
  createTaskWithIndefinite,
  updateTaskWithIndefinite,
  completeTask,
} from "./progress";

interface DatabaseConfig {
  client: "sqlite3";
  connection: {
    filename: string;
  };
  useNullAsDefault?: boolean;
}

/**
 * Checks if the database file exists, and if not, initializes it.
 *
 * @param dbPath - Path to the SQLite database file.
 * @returns A Promise that resolves to the Knex database instance.
 */
export const getDBInstance = async (dbPath: string): Promise<Knex> => {
  const dbExists = await fs.pathExists(dbPath);

  if (dbExists) {
    console.log(chalk.yellow(`Database file already exists at ${dbPath}`));
    return knex({
      client: "sqlite3",
      connection: {
        filename: dbPath,
      },
      useNullAsDefault: false,
    });
  }

  return initDB(dbPath);
};

/**
 * Configures and returns a database instance using `knex`.
 *
 * @param dbPath - Path to the SQLite database file.
 * @returns A Promise that resolves to the configured database instance.
 */
export const initDB = async (dbPath: string): Promise<Knex> => {
  const config: DatabaseConfig = {
    client: "sqlite3",
    connection: {
      filename: dbPath,
    },
    useNullAsDefault: false,
  };

  const db = knex(config);
  const taskName: string = "Creating Database Data Tables";
  createTaskWithIndefinite(taskName, { type: "indefinite" });

  const schemaEntries = Object.entries(schemas);

  await Promise.all(
    schemaEntries.map(async ([tableName, schema]) => {
      await createTable(db, tableName, schema);
      console.log(chalk.green(`Table created: ${tableName}`));
      updateTaskWithIndefinite(taskName, `Table created: ${tableName}`);
    })
  );

  completeTask(taskName);
  return db;
};

/**
 * Generic function to create a table with a specified schema.
 *
 * @param db - The Knex database instance.
 * @param tableName - The name of the table to create.
 * @param schema - A callback function defining the table schema.
 */
const createTable = async (
  db: Knex,
  tableName: string,
  schema: (table: Knex.CreateTableBuilder) => void
): Promise<void> => {
  console.log(chalk.blue(`Creating table: ${tableName}`));
  await db.schema.createTable(tableName, schema);
};
