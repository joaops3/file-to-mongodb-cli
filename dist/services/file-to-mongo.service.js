"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FileToMongoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileToMongoService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const stream_json_1 = require("stream-json");
const StreamArray_1 = require("stream-json/streamers/StreamArray");
const Batch_1 = require("stream-json/utils/Batch");
const stream_chain_1 = require("stream-chain");
const ExcelJS = require("exceljs");
const mongo_service_1 = require("./mongo.service");
const csv = require("csv-parser");
const mongoose_1 = require("mongoose");
const utils_1 = require("../utils");
const modifyData = (data) => {
    return data.value;
};
let FileToMongoService = FileToMongoService_1 = class FileToMongoService {
    constructor(mongoService) {
        this.mongoService = mongoService;
        this.logger = new common_1.Logger(FileToMongoService_1.name);
    }
    async executeJsonToMongo(inputFile, collection) {
        this.connection = await this.mongoService.initMongo();
        if (!this.connection)
            return;
        const schema = new mongoose_1.Schema({}, { strict: false, collection: collection, timestamps: true });
        const model = this.connection.model(collection, schema);
        const pipeline = (0, stream_chain_1.chain)([
            (0, fs_1.createReadStream)(inputFile),
            (0, stream_json_1.parser)(),
            (0, StreamArray_1.streamArray)(),
            async function* (data) {
                yield modifyData(data);
            },
            (0, Batch_1.batch)({ batchSize: 1000 }),
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
    async executeConvertExcelToMongo(inputFileUrl, collection) {
        this.connection = await this.mongoService.initMongo();
        if (!this.connection)
            return;
        const schema = new this.connection.Schema({}, { strict: false, collection: collection, timestamps: true });
        const model = this.connection.model(collection, schema);
        const valid = await (0, utils_1.isValidExcelFile)(inputFileUrl);
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
                    const rowValues = row.values;
                    if (firstRow) {
                        headers = rowValues.slice(1);
                        firstRow = false;
                    }
                    else {
                        const values = rowValues.slice(1);
                        const jsonRow = {};
                        headers.forEach((header, index) => {
                            jsonRow[header] = values[index];
                        });
                        await model.insertMany([jsonRow]);
                    }
                }
                catch (e) {
                    console.error('Insert failed:', e);
                }
            }
        }
        console.log('XLSX file successfully processed');
        await this.connection.disconnect();
        return;
    }
    async executeConvertCSVToMongo(inputFileUrl, collection) {
        this.connection = await this.mongoService.initMongo();
        if (!this.connection)
            return;
        try {
            const schema = new this.connection.Schema({}, { strict: false, collection: collection, timestamps: true });
            const model = this.connection.model(collection, schema);
            let first = true;
            let headers = {};
            let batch = [];
            (0, fs_1.createReadStream)(inputFileUrl)
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
                Object.values(headers).forEach((k, i) => {
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
        }
        catch (error) {
            console.error('Unexpected error:', error.message);
            await this.connection.disconnect();
        }
    }
};
exports.FileToMongoService = FileToMongoService;
exports.FileToMongoService = FileToMongoService = FileToMongoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mongo_service_1.MongoService])
], FileToMongoService);
//# sourceMappingURL=file-to-mongo.service.js.map