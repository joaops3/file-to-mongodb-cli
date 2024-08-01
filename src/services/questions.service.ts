import { Question, QuestionSet } from 'nest-commander';
import { verifyUri } from '../utils';

@QuestionSet({ name: 'uri' })
export class QuestionsUriService {
  @Question({
    type: 'input',
    name: 'uri',
    message: 'Insert MongoDb URI:',
    validate: function (value: string) {
      if (!value) return false;
      const pass = verifyUri(value);
      if (pass) {
        return true;
      }
      return 'Please enter a valid URI';
    },
  })
  async getUri(val: string) {
    return val;
  }
}

@QuestionSet({ name: 'collection' })
export class QuestionsCollectionService {
  @Question({
    type: 'input',
    name: 'collection',
    message: 'Insert collection name:',
  })
  getCollection(val: string) {
    return val;
  }
}
