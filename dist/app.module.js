"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const command_handler_1 = require("./command-handler");
const questions_service_1 = require("./services/questions.service");
const mongo_service_1 = require("./services/mongo.service");
const file_to_json_service_1 = require("./services/file-to-json.service");
const file_to_mongo_service_1 = require("./services/file-to-mongo.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [],
        providers: [
            command_handler_1.BasicCommand,
            questions_service_1.QuestionsUriService,
            questions_service_1.QuestionsCollectionService,
            file_to_mongo_service_1.FileToMongoService,
            file_to_json_service_1.FileToJsonService,
            mongo_service_1.MongoService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map