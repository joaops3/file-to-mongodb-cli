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
exports.MongoService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const mongoose_1 = require("mongoose");
const path_1 = require("path");
let MongoService = class MongoService {
    constructor() {
        this.path = (0, path_1.join)(__dirname, '..', '..', 'credentials.txt');
    }
    async initMongo(url) {
        let connectUrl;
        try {
            if (!url) {
                connectUrl = await this.getUrl();
            }
            else {
                connectUrl = url;
            }
        }
        catch (e) {
            return;
        }
        try {
            const conn = await mongoose_1.default.connect(connectUrl);
            return conn;
        }
        catch (e) {
            console.log('Mongo Connection Failed', e);
            return;
        }
    }
    async saveMongoUrl(url) {
        try {
            (0, fs_1.writeFileSync)(this.path, url, 'utf-8');
        }
        catch (error) {
            console.error('Error saving Mongo URI:', error);
            return undefined;
        }
        return url;
    }
    async getUrl() {
        if ((0, fs_1.existsSync)(this.path)) {
            const existingUrl = (0, fs_1.readFileSync)(this.path, 'utf-8').trim();
            if (!existingUrl) {
                return null;
            }
            return existingUrl;
        }
        else {
            return null;
        }
    }
};
exports.MongoService = MongoService;
exports.MongoService = MongoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MongoService);
//# sourceMappingURL=mongo.service.js.map