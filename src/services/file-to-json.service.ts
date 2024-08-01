import { Injectable } from '@nestjs/common';
import { createReadStream, createWriteStream } from 'fs';
import * as ExcelJS from 'exceljs';
import * as csv from 'csv-parser';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';
import { batch } from 'stream-json/utils/Batch';
import { chain } from 'stream-chain';
import { isValidExcelFile } from '../utils';
const modifyData = (data) => {
  return data.value;
};

@Injectable()
export class FileToJsonService {
  constructor() {}

  async executeJsonStream(inputFileUrl: string, outputUrl: string) {
    const file = createReadStream(outputUrl + `${Date.now()}.json`);

    const outputStream = createWriteStream(inputFileUrl);

    let validJson = [];

    file.on('data', (chunk) => {
      validJson.push(chunk.toString());

      if (chunk.toString().trim().endsWith('}')) {
        outputStream.write(validJson.toString());
        validJson = [];
      }
    });

    file.on('end', () => {
      if (validJson.length > 0) {
        outputStream.write(validJson.toString());
        file.destroy();
      }
      outputStream.end();
    });

    outputStream.on('error', (e) => {
      file.destroy();
      outputStream.end();
      console.log('error: ', e);
      process.exit(1);
    });
  }

  async executeJsonToJsonFormatted(inputFile: string, outputUrl: string) {
    const writeStream = createWriteStream(outputUrl + `${Date.now()}.json`);
    const pipeline = chain([
      createReadStream(inputFile),
      parser(),
      streamArray(),
      async function* (data) {
        yield modifyData(data);
      },
      batch({ batchSize: 1000 }),
      writeStream.write,
    ]);

    pipeline.on('data', async (data) => {
      data;
    });

    pipeline.on('error', (err) => {
      console.error('Pipeline failed', err);
    });

    pipeline.on('finish', () => {
      console.log('Insert Finished');
    });
  }

  async executeConvertExcelToJson(inputFileUrl: string, outputUrl: string) {
    const valid = await isValidExcelFile(inputFileUrl);

    if (!valid) {
      return;
    }

    const workbookPath = inputFileUrl;
    const workbook = new ExcelJS.stream.xlsx.WorkbookReader(workbookPath, {});
    let index = 1;

    for await (const worksheetReader of workbook) {
      const sheetName = `Sheet-${index}`;
      const outputFilePath = outputUrl + `Sheet-${index}-${Date.now()}.json`;
      const writeStream = createWriteStream(outputFilePath);

      writeStream.write('[');

      let firstRow = true;
      let headers = [];

      for await (const row of worksheetReader) {
        const rowValues = row.values as any;

        if (firstRow) {
          headers = rowValues.slice(1);
          firstRow = false;
        } else {
          const values = rowValues.slice(1);
          const jsonRow = {};
          headers.forEach((header, index) => {
            jsonRow[header] = values[index];
          });

          writeStream.write(JSON.stringify(jsonRow) + ',' + '\n');
        }
      }

      writeStream.write(']');
      writeStream.end();

      writeStream.on('finish', () => {
        console.log(
          `Excel sheet "${sheetName}" has been converted to JSON and saved successfully.`,
        );
      });

      writeStream.on('error', () => {
        console.error(`Error writing JSON file for sheet "${sheetName}"`);
      });
      index++;
      return outputUrl;
    }
  }

  async executeConvertCSVToJson(inputFileUrl: string, outputUrl: string) {
    try {
      const writeStream = createWriteStream(outputUrl + `${Date.now()}.json`);
      let first = true;
      let headers = {};

      let batch = [];
      createReadStream(inputFileUrl)
        .on('error', (error) => {
          console.error('Error opening file:', error.message);
        })
        .pipe(csv())
        .on('data', (data) => {
          if (first) {
            first = false;
            headers = data;
            return;
          }
          const obj = {};
          const values = Object.values(data);
          Object.values(headers).forEach((k: string, i) => {
            obj[k] = values[i];
          });

          batch.push(obj);

          if (batch.length > 500) {
            writeStream.write(batch);
            batch = [];
          }
        })
        .on('end', () => {
          if (batch.length > 0) {
            writeStream.write(batch);
            batch = [];
          }

          console.log('CSV file successfully processed');
        })
        .on('error', (error) => {
          console.error('CSV parsing error:', error.message);
        });
    } catch (error) {
      console.error('Unexpected error:', error.message);
    }
  }
}
