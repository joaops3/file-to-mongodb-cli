"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidExcelFile = void 0;
exports.validFileType = validFileType;
exports.verifyUri = verifyUri;
const ExcelJS = require("exceljs");
const isValidExcelFile = async (filePath) => {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        return true;
    }
    catch (error) {
        console.error('Invalid file type');
        return false;
    }
};
exports.isValidExcelFile = isValidExcelFile;
function validFileType(filename) {
    const lowercaseFilename = filename.toLowerCase();
    if (lowercaseFilename.endsWith('.xlsx')) {
        return 'xlsx';
    }
    else if (lowercaseFilename.endsWith('.csv')) {
        return 'csv';
    }
    else if (lowercaseFilename.endsWith('.json')) {
        return 'json';
    }
    else {
        return null;
    }
}
function verifyUri(uri) {
    const regex = /^mongodb(?:\+srv)?:\/\/(?:[^:]+:[^@]+@)?(?:[\w.-]+)(?::\d+)?(?:,[\w.-]+(?::\d+)?)*(?:\/[\w.-]*)?(?:\?.*)?$/;
    return regex.test(uri);
}
//# sourceMappingURL=index.js.map