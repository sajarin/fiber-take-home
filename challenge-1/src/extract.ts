import * as fs from "fs";
import * as path from "path";
import * as zlib from "zlib";
import * as tar from "tar-stream";
import { PassThrough } from "stream";
import chalk from "chalk";
import {
  createTaskWithIndefinite,
  updateTaskWithIndefinite,
  completeTask,
} from "./progress";

/**
 * Ensures that the specified directory exists and creates it, if it doesn't
 * @param dir - Directory path to check exists
 */
const ensureDirectory = (dir: string): void => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
};

/**
 * Decompresses a GZIP file and extracts the TAR archive
 *
 * @param source - Path to the source .tar.gz file
 * @param destination - Directory where the extracted files are saved
 * @returns Promise that resolves on complete extraction
 */
export const decompressAndExtract = async (
  source: string,
  destination: string
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    ensureDirectory(destination);

    const extract: tar.Extract = tar.extract();
    const taskName: string = "Extracting All Compressed Files";
    createTaskWithIndefinite(taskName, { type: "indefinite" });

    fs.createReadStream(source)
      .pipe(zlib.createGunzip())
      .pipe(extract)
      .on("error", reject);

    extract.on(
      "entry",
      (header: tar.Headers, stream: PassThrough, next: () => void) => {
        updateTaskWithIndefinite(taskName, `Extracting: ${header.name}`);

        const filePath: string = path.join(destination, header.name);
        const subDir: string = path.dirname(filePath);

        if (header.type === "directory") {
          ensureDirectory(filePath);
          console.log(chalk.yellow(`Skipped: Directory ${filePath}`));
          next();
        } else if (
          path.basename(filePath).startsWith("_") ||
          path.basename(filePath).startsWith(".")
        ) {
          console.log(chalk.yellow(`Skipped: ${filePath}`));
          stream.resume();
          next();
        } else {
          ensureDirectory(subDir);
          stream
            .pipe(fs.createWriteStream(filePath))
            .on("finish", () => {
              console.log(chalk.green(`Extracted: ${filePath}`));
              next();
            })
            .on("error", reject);
        }
      }
    );

    extract.on("finish", () => {
      completeTask(taskName);
      resolve();
    });

    extract.on("error", reject);
  });
};
