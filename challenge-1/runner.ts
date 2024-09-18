import { DUMP_DOWNLOAD_URL } from './resources';
import { downloadFile } from './download';
import { decompressAndExtract } from './extract';

const downloadPath: string = 'tmp/dump.tar.gz';
const extractPath: string = 'tmp/';

const main = async () => {
  try {
    // await downloadFile(DUMP_DOWNLOAD_URL, downloadPath);
    // console.log('File downloaded successfully.');

    await decompressAndExtract(downloadPath, extractPath);
    console.log('File decompressed and extracted successfully.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

main();