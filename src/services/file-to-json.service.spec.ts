/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { FileToJsonService } from '../services/file-to-json.service';

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
    it('should exec', async () => {});
  });
});
