export declare class FileToJsonService {
    constructor();
    executeJsonStream(inputFileUrl: string, outputUrl: string): Promise<void>;
    executeJsonToJsonFormatted(inputFile: string, outputUrl: string): Promise<void>;
    executeConvertExcelToJson(inputFileUrl: string, outputUrl: string): Promise<string>;
    executeConvertCSVToJson(inputFileUrl: string, outputUrl: string): Promise<void>;
}
