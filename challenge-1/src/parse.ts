import fs from "fs";
import { Knex } from "knex";
import { inferSchema, initParser, Schema } from "udsv"; // Import uDSV and related types
import { Customer, Organization } from "./schemas";
import chalk from "chalk";
import {
  createTaskWithPercentage,
  updateTaskWithPercentage,
  completeTask,
} from "./progress";

const CHUNK_SIZE = 300000;

type DBRecord = Customer | Organization;

const parseCSV = async (
  filePath: string,
  db: Knex,
  tableName: string
): Promise<void> => {
  const stream = fs.createReadStream(filePath);
  let rows: DBRecord[] = [];
  let parser: any | null = null;
  let totalRows = 0; // Track total rows processed so far

  const taskName: string = `Processing ${tableName}`;
  createTaskWithPercentage(taskName, { type: "percentage" });

  return new Promise((resolve, reject) => {
    const ROW_COUNT = 2000000;
    stream.on("data", async (chunk: Buffer) => {
      const strChunk = chunk.toString();
      if (!parser) {
        const schema: Schema = inferSchema(strChunk);
        parser = initParser(schema);
      }
      parser!.chunk(
        strChunk,
        parser!.typedObjs,
        async (parsedRows: DBRecord[]) => {
          rows = [...rows, ...parsedRows];
          totalRows += parsedRows.length;
          if (totalRows <= ROW_COUNT) {
            updateTaskWithPercentage(taskName, {
              percentage: totalRows / 2000000,
            });
          }

          if (rows.length >= CHUNK_SIZE) {
            stream.pause();
            try {
              await insertBatch(rows.slice(0, CHUNK_SIZE), tableName, db);
              rows = rows.slice(CHUNK_SIZE);
              stream.resume();
            } catch (error) {
              console.log(chalk.red(`Chunk insert failed: ${error}`));
              reject(error);
            }
          }
        }
      );
    });

    stream.on("end", async () => {
      // Ensure all rows are processed and inserted
      if (rows.length) {
        try {
          console.log(
            chalk.yellow(`Inserting remaining rows for ${tableName}`)
          );
          await insertBatch(rows, tableName, db);
          console.log(
            chalk.green(`CSV parsing and insertion completed for ${tableName}`)
          );
          resolve();
        } catch (error) {
          console.log(chalk.red(`Final insert failed: ${error}`));
          reject(error);
        }
      } else {
        console.log(
          chalk.green(`CSV parsing and insertion completed for ${tableName}`)
        );
        resolve();
      }
      completeTask(taskName);
    });

    stream.on("error", (error: Error) => {
      console.log(chalk.red(`Error during parsing: ${error}`));
      reject(error);
    });
  });
};

const insertBatch = async (
  rows: DBRecord[],
  tableName: string,
  db: Knex
): Promise<void> => {
  await db.transaction(async (trx) => {
    const chunks = rows
      .map(
        (record) =>
          `(${Object.values(record)
            .map((value) => db.raw("?", [value]))
            .join(",")})`
      )
      .join(",");
    const columns = Object.keys(rows[0])
      .map((col) => db.raw("??", [col]))
      .join(",");
    const query = `INSERT INTO ?? (${columns}) VALUES ${chunks}`;

    await trx.raw(query, [tableName]);
    console.log(chalk.green(`Inserted ${rows.length} rows into ${tableName}`));
  });
};

export { parseCSV };
