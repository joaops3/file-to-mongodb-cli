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
exports.BasicCommand = void 0;
const nest_commander_1 = require("nest-commander");
const mongo_service_1 = require("./services/mongo.service");
const file_to_mongo_service_1 = require("./services/file-to-mongo.service");
const file_to_json_service_1 = require("./services/file-to-json.service");
const utils_1 = require("./utils");
const cli_spinner_1 = require("cli-spinner");
let BasicCommand = class BasicCommand extends nest_commander_1.CommandRunner {
    constructor(fileToMongoService, fileToJsonService, mongoService, questionService) {
        super();
        this.fileToMongoService = fileToMongoService;
        this.fileToJsonService = fileToJsonService;
        this.mongoService = mongoService;
        this.questionService = questionService;
    }
    async run(passedParams, options) {
        if ('db' in options) {
            const uri = await this.mongoService.getUrl();
            console.log(uri ? `URI: ${uri}` : 'URI not configured');
            return;
        }
        if (options.input) {
            const valid = (0, utils_1.validFileType)(options?.input);
            if (!valid) {
                console.log('Invalid File Type');
                return;
            }
            if (options.uri) {
                const validUri = (0, utils_1.verifyUri)(options?.uri);
                if (!validUri) {
                    options.uri = null;
                }
            }
            let uri;
            uri = options.uri;
            if (!options.uri) {
                uri = await this.mongoService.getUrl();
            }
            if (!uri) {
                try {
                    uri = (await this.questionService.ask('uri', options)).uri;
                    uri = await this.mongoService.saveMongoUrl(uri);
                    options.uri = uri;
                }
                catch (e) {
                    console.log(e);
                    return;
                }
            }
            if (!options.collection) {
                options.collection = (await this.questionService.ask('collection', options)).collection;
            }
            const spinner = new cli_spinner_1.Spinner('processing.. %s');
            spinner.setSpinnerString('|/-\\');
            spinner.start();
            try {
                if (valid === 'xlsx') {
                    await this.fileToMongoService.executeConvertExcelToMongo(options.input, options.collection);
                }
                if (valid === 'csv') {
                    await this.fileToMongoService.executeConvertCSVToMongo(options.input, options.collection);
                }
                if (valid === 'json') {
                    await this.fileToMongoService.executeJsonToMongo(options.input, options.collection);
                }
            }
            catch (e) {
                console.log(e);
            }
            spinner.stop(true);
            return;
        }
    }
    getInput(val) {
        return val;
    }
    getOutput(val) {
        return val;
    }
    getDbUri(val) {
        return val;
    }
    getCollectionName(val) {
        return val;
    }
    getDbConnection(val) {
        return val;
    }
};
exports.BasicCommand = BasicCommand;
__decorate([
    (0, nest_commander_1.Option)({
        flags: '-i, --input [input]',
        description: 'input file directory',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", String)
], BasicCommand.prototype, "getInput", null);
__decorate([
    (0, nest_commander_1.Option)({
        flags: '-o, --out [out]',
        description: 'output file directory',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", String)
], BasicCommand.prototype, "getOutput", null);
__decorate([
    (0, nest_commander_1.Option)({
        flags: '-u, --uri [uri]',
        description: 'MongoDb connection URI',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", String)
], BasicCommand.prototype, "getDbUri", null);
__decorate([
    (0, nest_commander_1.Option)({
        flags: '-c, --collection [collection]',
        description: 'Collection which will be inserted the converted data',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", String)
], BasicCommand.prototype, "getCollectionName", null);
__decorate([
    (0, nest_commander_1.Option)({
        flags: '-d, --db [db]',
        description: 'Show DB URI',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", String)
], BasicCommand.prototype, "getDbConnection", null);
exports.BasicCommand = BasicCommand = __decorate([
    (0, nest_commander_1.Command)({
        name: 'parse',
        description: 'Parse large files insert into mongoDB',
        options: { isDefault: true },
    }),
    __metadata("design:paramtypes", [file_to_mongo_service_1.FileToMongoService,
        file_to_json_service_1.FileToJsonService,
        mongo_service_1.MongoService,
        nest_commander_1.InquirerService])
], BasicCommand);
//# sourceMappingURL=command-handler.js.map