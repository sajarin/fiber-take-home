import * as fs from 'fs';
import * as path from 'path';
import axios, { AxiosHeaderValue } from 'axios';
import ProgressBar from 'progress';

/**
 * Downloads a file from the given URL to the specified destination.
 * Ensures the directory exists before downloading the file.
 * Uses axios for the HTTP request and Node.js Streams to write the file,
 * 
 * @param {string} url - The URL to download the file from.
 * @param {string} destination - Path to save the downloaded file.
 * @returns {Promise<void>} - A Promise that resolves when the download is complete.
 */
export const downloadFile = async (url: string, destination: string): Promise<void> => {
  const directory: string = path.dirname(destination);
  fs.mkdirSync(directory, { recursive: true });

  const writer: fs.WriteStream = fs.createWriteStream(destination);

  const response = await axios.get(url, { responseType: 'stream' });

  const totalLength: string = response.headers['content-length'];
  const progressBar = new ProgressBar('-> Downloading [:bar] :percent :etas', {
    width: 40,
    complete: '=',
    incomplete: ' ',
    renderThrottle: 16,
    total: parseInt(totalLength, 10)
  });

  response.data.on('data', (chunk: Buffer) => progressBar.tick(chunk.length));
  response.data.pipe(writer);

  return new Promise<void>((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};