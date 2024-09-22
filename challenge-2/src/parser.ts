import { createReadStream } from 'fs';
import * as fastcsv from 'fast-csv';
import { CSV_INPUT_PATH } from '../resources';
import { TEST_CSV_INPUT_PATH } from '../resources';

export interface CompanyCSV {
    name: string;
    url: string;
}

export const parseCSV = async (): Promise<CompanyCSV[]> => {
    const companies: CompanyCSV[] = [];
    return new Promise((resolve, reject) => {
        createReadStream(TEST_CSV_INPUT_PATH)
            .pipe(fastcsv.parse({ headers: true }))
            .on('data', (row: any) => {
                companies.push({
                    name: row['Company Name'],
                    url: row['YC URL']
                });
            })
            .on('end', () => resolve(companies))
            .on('error', reject);
    });
};