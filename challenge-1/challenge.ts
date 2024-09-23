import * as fs from "fs-extra";
import { decompressAndExtract } from "./src/extract";
import { downloadFile } from "./src/download";
import { getDBInstance } from "./src/db";
import { parseCSV } from "./src/parse";
import { DUMP_DOWNLOAD_URL } from "./resources";
import { exit } from "process";
import { completeAllTasks } from "./src/progress";

/**
 * The entry point function. This will download the given dump file, extract/decompress it,
 * parse the CSVs within, and add the data to a SQLite database.
 * This is the core function you'll need to edit, though you're encouraged to make helper
 * functions!
 */
const processDataDump = async (): Promise<void> => {
  const downloadPath = "tmp/dump.tar.gz";
  const extractPath = "tmp/";
  const dbPath = "out/database.sqlite";

  try {
    console.log("Starting download...");
    await downloadFile(DUMP_DOWNLOAD_URL, downloadPath); // Await download completion
    console.log("File downloaded successfully.");

    console.log("Starting extraction...");
    await decompressAndExtract(downloadPath, extractPath); // Await extraction completion
    console.log("File decompressed and extracted successfully.");

    console.log("Ensuring output directory exists...");
    await fs.ensureDir("out"); // Ensure the output directory exists
    console.log("Output directory is ready.");

    const db = await getDBInstance(dbPath); // Await database initialization
    console.log("Database initialized successfully.");

    console.log("Parsing CSV files...");
    await Promise.all([
      parseCSV(`${extractPath}/dump/customers.csv`, db, "customers"),
      parseCSV(`${extractPath}/dump/organizations.csv`, db, "organizations"),
    ]); // Await parsing completion
    await parseCSV(`${extractPath}/dump/customers.csv`, db, "customers"),
      await parseCSV(
        `${extractPath}/dump/organizations.csv`,
        db,
        "organizations"
      );
    console.log("CSV files parsed successfully.");
  } catch (error) {
    console.error("An error occurred:", error);
  }

  console.log("✅ Done!");
  // close progress bar
  completeAllTasks();
  exit(0);
};

export default processDataDump;
