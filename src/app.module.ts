import { Module } from '@nestjs/common';

import { BasicCommand } from './command-handler';
import {
  QuestionsUriService,
  QuestionsCollectionService,
} from './services/questions.service';
import { MongoService } from './services/mongo.service';
import { FileToJsonService } from './services/file-to-json.service';
import { FileToMongoService } from './services/file-to-mongo.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    BasicCommand,
    QuestionsUriService,
    QuestionsCollectionService,
    FileToMongoService,
    FileToJsonService,
    MongoService,
  ],
})
export class AppModule {}
