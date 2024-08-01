import { Injectable, Logger } from '@nestjs/common';
import { createReadStream } from 'fs';

import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';
import { batch } from 'stream-json/utils/Batch';
import { chain } from 'stream-chain';
import * as ExcelJS from 'exceljs';
import { MongoService } from './mongo.service';
import * as csv from 'csv-parser';
import { Model, Schema } from 'mongoose';
import { isValidExcelFile } from '../utils';

const modifyData = (data) => {
  return data.value;
};

@Injectable()
export class FileToMongoService {
  private connection: typeof import('mongoose');
  private readonly logger = new Logger(FileToMongoService.name);
  constructor(private readonly mongoService: MongoService) {}

  async executeJsonToMongo(inputFile: string, collection: string) {
    this.connection = await this.mongoService.initMongo();
    if (!this.connection) return;
    const schema = new Schema(
      {},
      { strict: false, collection: collection, timestamps: true },
    );
    const model: Model<unknown> = this.connection.model(collection, schema);

    const pipeline = chain([
      createReadStream(inputFile),
      parser(),
      streamArray(),
      async function* (data) {
        yield modifyData(data);
      },
      batch({ batchSize: 1000 }),
    ]);

    pipeline.on('data', async (data) => {
      await model.insertMany(data);
    });

    pipeline.on('error', async (err) => {
      await this.connection.disconnect();
      console.error('Insert failed', err);
      return;
    });

    pipeline.on('end', async () => {
      await this.connection.disconnect();
      console.log('Insert Finished');
      return;
    });
  }

  async executeConvertExcelToMongo(inputFileUrl: string, collection: string) {
    this.connection = await this.mongoService.initMongo();
    if (!this.connection) return;
    const schema = new this.connection.Schema(
      {},
      { strict: false, collection: collection, timestamps: true },
    );
    const model: Model<unknown> = this.connection.model(collection, schema);
    const valid = await isValidExcelFile(inputFileUrl);

    if (!valid) {
      return;
    }

    const workbookPath = inputFileUrl;
    const workbook = new ExcelJS.stream.xlsx.WorkbookReader(workbookPath, {});

    for await (const worksheetReader of workbook) {
      let firstRow = true;
      let headers = [];

      for await (const row of worksheetReader) {
        try {
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
            await model.insertMany([jsonRow]);
          }
        } catch (e) {
          console.error('Insert failed:', e);
        }
      }
    }
    console.log('XLSX file successfully processed');
    await this.connection.disconnect();
    return;
  }

  async executeConvertCSVToMongo(inputFileUrl: string, collection: string) {
    this.connection = await this.mongoService.initMongo();
    if (!this.connection) return;
    try {
      const schema = new this.connection.Schema(
        {},
        { strict: false, collection: collection, timestamps: true },
      );
      const model: Model<unknown> = this.connection.model(collection, schema);
      let first = true;
      let headers = {};

      let batch = [];
      createReadStream(inputFileUrl)
        .on('error', (error) => {
          console.error('Error opening file:', error.message);
        })
        .pipe(csv())
        .on('data', async (data) => {
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
            await model.insertMany(batch);
            batch = [];
          }
        })
        .on('end', async () => {
          if (batch.length > 0) {
            await model.insertMany(batch);
            batch = [];
          }
          await this.connection.disconnect();
          console.log('CSV file successfully processed');
        })
        .on('error', async (error) => {
          await this.connection.disconnect();
          console.error('Insert failed:', error.message);
        });
    } catch (error) {
      console.error('Unexpected error:', error.message);
      await this.connection.disconnect();
    }
  }
}
