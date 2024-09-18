import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import * as tar from 'tar-stream';
import { PassThrough } from 'stream';

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
export const decompressAndExtract = async (source: string, destination: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    ensureDirectory(destination); // Ensure the root destination directory exists, else create it
    
    const extract: tar.Extract = tar.extract();
    
    fs.createReadStream(source)
      .pipe(zlib.createGunzip())
      .pipe(extract)
      .on('error', reject);

    extract.on('entry', (header: tar.Headers, stream: PassThrough, next: () => void) => {
      const filePath: string = path.join(destination, header.name);
      const subDir: string = path.dirname(filePath);

      if (header.type === 'directory') {
        ensureDirectory(filePath);
        console.log(`\x1b[33mSkipped: Directory ${filePath}\x1b[0m`); // Yellow text
        next();
      } else if (path.basename(filePath).startsWith('_') || path.basename(filePath).startsWith('.')) {
        console.log(`\x1b[33mSkipped: ${filePath}\x1b[0m`); // Yellow text
        stream.resume();
        next();
      } else {
        ensureDirectory(subDir);  // Ensure the directory for the file exists
        stream.pipe(fs.createWriteStream(filePath))
          .on('finish', () => {
            console.log(`\x1b[32mExtracted: ${filePath}\x1b[0m`); // Green text
            next();
          })
          .on('error', reject);  // Handle stream errors
      }
    });

    extract.on('finish', resolve);
    extract.on('error', reject); 
  });
};