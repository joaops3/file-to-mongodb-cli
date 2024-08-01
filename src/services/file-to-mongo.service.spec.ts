/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { join } from 'path';
import { FileToMongoService } from './file-to-mongo.service';

const mockInputPath = join(__dirname, '..', 'mocks', 'test.csv');
const defaultUri = 'mongodb://root:root@localhost:27017';

describe('FileToMongoService', () => {
  let appService: FileToMongoService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [FileToMongoService],
    }).compile();

    appService = app.get<FileToMongoService>(FileToMongoService);
  });

  describe('CSV to Mongo', () => {
    it('should exec', async () => {
      expect(
        await appService.executeConvertCSVToMongo(mockInputPath, 'test'),
      ).toHaveBeenCalled();
    });
  });
});
