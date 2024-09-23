import { createReadStream } from 'fs';
import * as fastcsv from 'fast-csv';

export interface CompanyCSV {
    name: string;
    url: string;
}
export const parseCSV = async (filePath: string): Promise<CompanyCSV[]> => {
    const companies: CompanyCSV[] = [];
    return new Promise((resolve, reject) => {
        createReadStream(filePath)
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