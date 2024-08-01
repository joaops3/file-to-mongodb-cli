import { MongoService } from './mongo.service';
export declare class FileToMongoService {
    private readonly mongoService;
    private connection;
    private readonly logger;
    constructor(mongoService: MongoService);
    executeJsonToMongo(inputFile: string, collection: string): Promise<void>;
    executeConvertExcelToMongo(inputFileUrl: string, collection: string): Promise<void>;
    executeConvertCSVToMongo(inputFileUrl: string, collection: string): Promise<void>;
}
