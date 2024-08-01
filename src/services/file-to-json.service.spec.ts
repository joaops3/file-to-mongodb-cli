import { Test, TestingModule } from '@nestjs/testing';
import { join } from 'path';
import { FileToJsonService } from 'src/services/file-to-json.service';

const mockInputPath = join(__dirname, '..', 'mocks', 'test.csv');
const mockOutputPath = join(__dirname, '..', 'mocks');

describe('FileToJsonService', () => {
  let appService: FileToJsonService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [FileToJsonService],
    }).compile();

    appService = app.get<FileToJsonService>(FileToJsonService);
  });

  describe('CSV To JSON', () => {
    it('should exec', async () => {
      expect(
        await appService.executeConvertCSVToJson(mockInputPath, mockOutputPath),
      ).toHaveBeenCalled();
    });
  });
});
