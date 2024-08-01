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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileToJsonService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const ExcelJS = require("exceljs");
const csv = require("csv-parser");
const stream_json_1 = require("stream-json");
const StreamArray_1 = require("stream-json/streamers/StreamArray");
const Batch_1 = require("stream-json/utils/Batch");
const stream_chain_1 = require("stream-chain");
const utils_1 = require("../utils");
const modifyData = (data) => {
    return data.value;
};
let FileToJsonService = class FileToJsonService {
    constructor() { }
    async executeJsonStream(inputFileUrl, outputUrl) {
        const file = (0, fs_1.createReadStream)(outputUrl + `${Date.now()}.json`);
        const outputStream = (0, fs_1.createWriteStream)(inputFileUrl);
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
    async executeJsonToJsonFormatted(inputFile, outputUrl) {
        const writeStream = (0, fs_1.createWriteStream)(outputUrl + `${Date.now()}.json`);
        const pipeline = (0, stream_chain_1.chain)([
            (0, fs_1.createReadStream)(inputFile),
            (0, stream_json_1.parser)(),
            (0, StreamArray_1.streamArray)(),
            async function* (data) {
                yield modifyData(data);
            },
            (0, Batch_1.batch)({ batchSize: 1000 }),
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
    async executeConvertExcelToJson(inputFileUrl, outputUrl) {
        const valid = await (0, utils_1.isValidExcelFile)(inputFileUrl);
        if (!valid) {
            return;
        }
        const workbookPath = inputFileUrl;
        const workbook = new ExcelJS.stream.xlsx.WorkbookReader(workbookPath, {});
        let index = 1;
        for await (const worksheetReader of workbook) {
            const sheetName = `Sheet-${index}`;
            const outputFilePath = outputUrl + `Sheet-${index}-${Date.now()}.json`;
            const writeStream = (0, fs_1.createWriteStream)(outputFilePath);
            writeStream.write('[');
            let firstRow = true;
            let headers = [];
            for await (const row of worksheetReader) {
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
                    writeStream.write(JSON.stringify(jsonRow) + ',' + '\n');
                }
            }
            writeStream.write(']');
            writeStream.end();
            writeStream.on('finish', () => {
                console.log(`Excel sheet "${sheetName}" has been converted to JSON and saved successfully.`);
            });
            writeStream.on('error', () => {
                console.error(`Error writing JSON file for sheet "${sheetName}"`);
            });
            index++;
            return outputUrl;
        }
    }
    async executeConvertCSVToJson(inputFileUrl, outputUrl) {
        try {
            const writeStream = (0, fs_1.createWriteStream)(outputUrl + `${Date.now()}.json`);
            let first = true;
            let headers = {};
            let batch = [];
            (0, fs_1.createReadStream)(inputFileUrl)
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
                Object.values(headers).forEach((k, i) => {
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
        }
        catch (error) {
            console.error('Unexpected error:', error.message);
        }
    }
};
exports.FileToJsonService = FileToJsonService;
exports.FileToJsonService = FileToJsonService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FileToJsonService);
//# sourceMappingURL=file-to-json.service.js.map