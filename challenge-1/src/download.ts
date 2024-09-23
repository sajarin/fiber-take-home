import * as fs from "fs";
import * as fse from "fs-extra";
import * as path from "path";
import * as https from "https";
import { IncomingMessage } from "http";
import {
  createTaskWithPercentage,
  updateTaskWithPercentage,
  completeTask,
} from "./progress";

/**
 * Download a file from a URL
 *
 * @param url  - URL to download
 * @param destination - Local path to save the downloaded file
 */
export const downloadFile = async (
  url: string,
  destination: string
): Promise<void> => {
  fse.ensureDir(path.dirname(destination));
  const taskName: string = "Downloading All Required Files";
  createTaskWithPercentage(taskName, { type: "percentage" });

  await new Promise<void>((resolve, reject) => {
    https
      .get(url, (response: IncomingMessage) => {
        if (response.statusCode !== 200) {
          return reject(
            new Error(`Failed to get '${url}' (${response.statusCode})`)
          );
        }
        const totalLength: number = parseInt(
          response.headers["content-length"] || "0",
          10
        );
        var downloadedLength: number = 0;

        response.on("data", (chunk: Buffer) => {
          downloadedLength += chunk.length;
          const percentage = downloadedLength / totalLength;
          updateTaskWithPercentage(taskName, { percentage });
        });

        const writer: fs.WriteStream = fs.createWriteStream(destination);
        response.pipe(writer);

        writer.on("finish", () => {
          completeTask(taskName);
          resolve();
        });
        writer.on("error", reject);
        response.on("error", reject);
      })
      .on("error", reject);
  });
};
