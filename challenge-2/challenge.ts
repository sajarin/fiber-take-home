import * as fs from "fs-extra";
import { parseCSV } from "./src/parser";
import { scrapeCompany } from "./src/scraper";
import { JSON_OUTPUT_PATH } from "./resources";
import chalk from "chalk";

/**
 * The entry point function. This will read the provided CSV file, scrape the companies'
 * YC pages, and output structured data in a JSON file.
 */
export async function processCompanyList() {
  const companyList = await parseCSV();

  // For testing purposes, only scrape the first company and output its contents
  const result = await scrapeCompany(companyList[0]);

  console.log(chalk.rgb(222, 173, 237)("Scraped data for the first company:"));
  console.log(result);
  // await fs.outputJSON(JSON_OUTPUT_PATH, result);

  // const result = await Promise.all(companyList.map(scrapeCompany));
  // await fs.outputJson(JSON_OUTPUT_PATH, result, { spaces: 2 });
}
