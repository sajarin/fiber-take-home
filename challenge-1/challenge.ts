import { downloadFile} from './download';
import { decompressAndExtract } from './extract';
import { setupDatabase } from './db';
import { processCSV } from './csvProcessor';
import { DUMP_DOWNLOAD_URL, SQLITE_DB_PATH, DUMP_LOCAL_PATH, EXTRACT_PATH} from './resources';

/**
 * The entry point function. This will download the given dump file, extract/decompress it,
 * parse the CSVs within, and add the data to a SQLite database.
 * This is the core function you'll need to edit, though you're encouraged to make helper
 * functions!
 */
const processDataDump = async (): Promise<void> => {
  console.log("processing data dump...")
  const tarFileUrl = DUMP_DOWNLOAD_URL;
  const downloadPath = DUMP_LOCAL_PATH;
  const extractPath = EXTRACT_PATH;
  const dbPath = SQLITE_DB_PATH

  await downloadFile(tarFileUrl, downloadPath);
  await decompressAndExtract(downloadPath, extractPath);

  const db = await setupDatabase(dbPath);

  await processCSV(`${extractPath}/customers.csv`, db, 'customers');
  await processCSV(`${extractPath}/organizations.csv`, db, 'organizations');
  console.log("✅ Done!");
};

export default processDataDump;
