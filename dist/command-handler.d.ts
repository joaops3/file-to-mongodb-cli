import { CommandRunner, InquirerService } from 'nest-commander';
import { MongoService } from './services/mongo.service';
import { FileToMongoService } from './services/file-to-mongo.service';
import { FileToJsonService } from './services/file-to-json.service';
interface ICommandOptions {
    uri: string | null;
    collection: string | null;
    input: string | null;
    output: string | null;
    db?: any;
}
export declare class BasicCommand extends CommandRunner {
    private readonly fileToMongoService;
    private readonly fileToJsonService;
    private readonly mongoService;
    private readonly questionService;
    constructor(fileToMongoService: FileToMongoService, fileToJsonService: FileToJsonService, mongoService: MongoService, questionService: InquirerService);
    run(passedParams: string[], options?: ICommandOptions): Promise<void>;
    getInput(val: string): string;
    getOutput(val: string): string;
    getDbUri(val: string): string;
    getCollectionName(val: string): string;
    getDbConnection(val: string): string;
}
export {};
