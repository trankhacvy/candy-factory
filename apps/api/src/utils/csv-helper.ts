import { Readable } from 'stream';
import csvParser from 'csv-parser';

export function getCsvFileFromFileName(buffer: Buffer) {
  return new Promise(function (resolve, reject) {
    const results: any = [];
    Readable.from(buffer)
      .pipe(csvParser())
      .on('data', (row) => {
        results.push(row);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', reject);
  });
}
