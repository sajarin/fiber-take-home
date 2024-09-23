import fs from "fs-extra";
import { parseCSV } from "./src/parser";
import { scrapeCompany } from "./src/scraper";
import { Record } from "./src/schemas";
import { JSON_OUTPUT_PATH, CSV_INPUT_PATH } from "./resources";
import chalk from "chalk";

/**
 * The entry point function. This will read the provided CSV file, scrape the companies'
 * YC pages, and output structured data in a JSON file.
 */
export async function processCompanyList() {
  const companyList = await parseCSV(CSV_INPUT_PATH);

  // Ensure the output directory exists.
  await fs.ensureDir("out/");

  // Initialize an array to store all scraped data.
  const scrapedData: Record[] = [];

  // Scrape each company sequentially and store the result.
  for (const company of companyList) {
    try {
      const data = await scrapeCompany(company);
      console.log(`Scraped data for ${company}:`, data);
      scrapedData.push(data);
    } catch (error) {
      console.error(`Error scraping company ${company}:`, error);
    }
  }

  await fs.writeJson(JSON_OUTPUT_PATH, scrapedData, { spaces: 2 });
  console.log(chalk.green("Data has been written to:"), JSON_OUTPUT_PATH);
}
