/* eslint-disable @typescript-eslint/no-unused-vars */
import { TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as execa from 'execa';
import * as path from 'path';
import { CommandTestFactory } from 'nest-commander-testing';
import { FileToJsonService } from '../src/services/file-to-json.service';
import { MongoService } from '../src/services/mongo.service';
const defaultUri = 'mongodb://root:root@localhost:27017';

describe('CLI E2E Tests', () => {
  let commandInstance: TestingModule;
  let fileToMongoService: FileToJsonService;
  let mongoService: MongoService;

  const cliPath = path.join(__dirname, '../dist/main.js');
  beforeAll(async () => {
    commandInstance = await CommandTestFactory.createTestingCommand({
      imports: [AppModule],
    }).compile();
    fileToMongoService =
      commandInstance.get<FileToJsonService>(FileToJsonService);
    mongoService = commandInstance.get<MongoService>(MongoService);
  });

  it('should return URI not configured', async () => {
    const result = await execa.node(cliPath, ['parse', '--db']);

    expect(result.stdout).toContain('URI not configured');
  });

  it('should return CSV file successfully processed', async () => {
    const result = await execa.node(cliPath, [
      '--input',
      '../mocks/test.csv',
      '-c',
      'test',
      '--uri',
      `${defaultUri}`,
    ]);

    expect(result.stdout).toContain('CSV file successfully processed');
  });
});
