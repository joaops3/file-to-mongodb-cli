#!/usr/bin/env node

import { AppModule } from './app.module';
import { CommandFactory } from 'nest-commander';

process.on('unhandledRejection', (reason) => {
  console.error(reason);
  process.exit(-1);
});

process.on('uncaughtException', (reason) => {
  console.error(reason);
  process.exit(-1);
});

async function bootstrap() {
  await CommandFactory.run(AppModule);
}
bootstrap();
