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
exports.QuestionsCollectionService = exports.QuestionsUriService = void 0;
const nest_commander_1 = require("nest-commander");
const utils_1 = require("../utils");
let QuestionsUriService = class QuestionsUriService {
    async getUri(val) {
        return val;
    }
};
exports.QuestionsUriService = QuestionsUriService;
__decorate([
    (0, nest_commander_1.Question)({
        type: 'input',
        name: 'uri',
        message: 'Insert MongoDb URI:',
        validate: function (value) {
            if (!value)
                return false;
            const pass = (0, utils_1.verifyUri)(value);
            if (pass) {
                return true;
            }
            return 'Please enter a valid URI';
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuestionsUriService.prototype, "getUri", null);
exports.QuestionsUriService = QuestionsUriService = __decorate([
    (0, nest_commander_1.QuestionSet)({ name: 'uri' })
], QuestionsUriService);
let QuestionsCollectionService = class QuestionsCollectionService {
    getCollection(val) {
        return val;
    }
};
exports.QuestionsCollectionService = QuestionsCollectionService;
__decorate([
    (0, nest_commander_1.Question)({
        type: 'input',
        name: 'collection',
        message: 'Insert collection name:',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuestionsCollectionService.prototype, "getCollection", null);
exports.QuestionsCollectionService = QuestionsCollectionService = __decorate([
    (0, nest_commander_1.QuestionSet)({ name: 'collection' })
], QuestionsCollectionService);
//# sourceMappingURL=questions.service.js.map