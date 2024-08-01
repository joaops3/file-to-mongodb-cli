import * as ExcelJS from 'exceljs';

export type ValidFIleTypes = ['xlsx', 'csv', 'json'][number];

export const isValidExcelFile = async (filePath: string): Promise<boolean> => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    return true;
  } catch (error) {
    console.error('Invalid file type');
    return false;
  }
};

export function validFileType(filename: string): ValidFIleTypes | null {
  const lowercaseFilename = filename.toLowerCase();

  if (lowercaseFilename.endsWith('.xlsx')) {
    return 'xlsx';
  } else if (lowercaseFilename.endsWith('.csv')) {
    return 'csv';
  } else if (lowercaseFilename.endsWith('.json')) {
    return 'json';
  } else {
    return null;
  }
}

export function verifyUri(uri: string): boolean {
  const regex =
    /^mongodb(?:\+srv)?:\/\/(?:[^:]+:[^@]+@)?(?:[\w.-]+)(?::\d+)?(?:,[\w.-]+(?::\d+)?)*(?:\/[\w.-]*)?(?:\?.*)?$/;
  return regex.test(uri);
}
