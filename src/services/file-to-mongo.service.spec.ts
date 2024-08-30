import { Test, TestingModule } from '@nestjs/testing';
import { join } from 'path';
import { FileToMongoService } from './file-to-mongo.service';
import { MongoService } from './mongo.service';
import { createReadStream } from 'fs';

const mockInputPath = join(__dirname, '..', 'mocks', 'test.csv');

jest.mock('fs');
jest.mock('stream-chain');
jest.mock('exceljs');
jest.mock('csv-parser');
const modelMock = {
  insertMany: jest.fn().mockResolvedValue(undefined),
};
const MongoServiceMock = {
  initMongo: jest.fn().mockResolvedValue({
    model: jest.fn().mockResolvedValue(modelMock),
    disconnect: jest.fn(),
    Schema: jest.fn(),
  }),
};

describe('FileToMongoService', () => {
  let appService: FileToMongoService;
  let mongoService: MongoService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        FileToMongoService,
        { provide: MongoService, useValue: MongoServiceMock },
      ],
    }).compile();

    appService = app.get<FileToMongoService>(FileToMongoService);
    mongoService = app.get<MongoService>(MongoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('CSV to Mongo', () => {
    it('should exec successfully', async () => {
      const spyInitMongo = jest.spyOn(mongoService, 'initMongo');

      const spyModelInsertMany = jest.spyOn(modelMock, 'insertMany');

      (mongoService.initMongo as jest.Mock).mockResolvedValue({
        model: jest.fn().mockReturnValue(modelMock),
        disconnect: jest.fn(),
        Schema: jest.fn(),
      });

      (createReadStream as jest.Mock).mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        on: jest.fn().mockImplementation(function (this, event, callback) {
          if (event === 'data') {
            for (let i = 0; i < 600; i++) {
              callback({ col1: `val${i + 1}`, col2: `val${i + 1}` });
            }
          }
          if (event === 'end') callback();
          return this;
        }),
      });
      await appService.executeConvertCSVToMongo(
        mockInputPath,
        'testCollection',
      );
      const model = (await mongoService.initMongo()).model;

      expect(spyInitMongo).toHaveBeenCalled();
      expect(spyModelInsertMany).toHaveBeenCalled();
      expect(model).toHaveBeenCalledWith('testCollection', expect.anything());
    });

    it('should handle errors during CSV processing', async () => {
      const mockError = new Error('mock error');

      (createReadStream as jest.Mock).mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'error') {
            callback(mockError);
          }
          return this;
        }),
      });

      console.error = jest.fn();

      await appService.executeConvertCSVToMongo(
        'mockFile.csv',
        'mockCollection',
      );

      expect(console.error).toHaveBeenCalledWith(
        'Error opening file:',
        mockError.message,
      );
    });
  });
});
