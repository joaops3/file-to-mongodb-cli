import {
  Command,
  CommandRunner,
  InquirerService,
  Option,
} from 'nest-commander';

import { MongoService } from './services/mongo.service';
import { FileToMongoService } from './services/file-to-mongo.service';
import { validFileType, verifyUri } from './utils';
import { Spinner } from 'cli-spinner';
interface ICommandOptions {
  uri: string | null;
  collection: string | null;
  input: string | null;
  output: string | null;
  db?: any;
}

@Command({
  name: 'parse',
  description: 'Parse large files and insert into mongoDB',
  options: { isDefault: true },
})
export class BasicCommand extends CommandRunner {
  constructor(
    private readonly fileToMongoService: FileToMongoService,
    private readonly mongoService: MongoService,
    private readonly questionService: InquirerService,
  ) {
    super();
  }

  async run(passedParams: string[], options?: ICommandOptions): Promise<void> {
    if ('db' in options) {
      const uri = await this.mongoService.getUrl();
      console.log(uri ? `URI: ${uri}` : 'URI not configured');
      return;
    }
    if (options.input) {
      const valid = validFileType(options?.input);
      if (!valid) {
        console.log('Invalid File Type');
        return;
      }
      if (options.uri) {
        const validUri = verifyUri(options?.uri);
        if (!validUri) {
          options.uri = null;
        }
      }

      let uri: string;
      uri = options.uri;
      if (!options.uri) {
        uri = await this.mongoService.getUrl();
      }

      if (!uri) {
        try {
          uri = (await this.questionService.ask('uri', options)).uri;
          uri = await this.mongoService.saveMongoUrl(uri);
          options.uri = uri;
        } catch (e) {
          console.log(e);
          return;
        }
      }

      if (!options.collection) {
        options.collection = (
          await this.questionService.ask('collection', options)
        ).collection;
      }
      const spinner = new Spinner('processing.. %s');
      spinner.setSpinnerString('|/-\\');
      spinner.start();
      try {
        if (valid === 'xlsx') {
          await this.fileToMongoService.executeConvertExcelToMongo(
            options.input,
            options.collection,
          );
        }
        if (valid === 'csv') {
          await this.fileToMongoService.executeConvertCSVToMongo(
            options.input,
            options.collection,
          );
        }
        if (valid === 'json') {
          await this.fileToMongoService.executeJsonToMongo(
            options.input,
            options.collection,
          );
        }
      } catch (e) {
        console.log(e);
      }

      spinner.stop(true);
      return;
    }
  }

  @Option({
    flags: '-i, --input [input]',
    description: 'input file directory',
  })
  getInput(val: string): string {
    return val;
  }

  @Option({
    flags: '-o, --out [out]',
    description: 'output file directory',
  })
  getOutput(val: string): string {
    return val;
  }

  @Option({
    flags: '-u, --uri [uri]',
    description: 'MongoDb connection URI',
  })
  getDbUri(val: string): string {
    return val;
  }

  @Option({
    flags: '-c, --collection [collection]',
    description: 'Collection which will be inserted the converted data',
  })
  getCollectionName(val: string): string {
    return val;
  }

  @Option({
    flags: '-d, --db [db]',
    description: 'Show DB URI',
  })
  getDbConnection(val: string): string {
    return val;
  }
}
