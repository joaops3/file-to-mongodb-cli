export type ValidFIleTypes = ['xlsx', 'csv', 'json'][number];
export declare const isValidExcelFile: (filePath: string) => Promise<boolean>;
export declare function validFileType(filename: string): ValidFIleTypes | null;
export declare function verifyUri(uri: string): boolean;
