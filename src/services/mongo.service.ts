import { Injectable } from '@nestjs/common';
import { writeFileSync, existsSync, readFileSync } from 'fs';
import mongoose from 'mongoose';
import { join } from 'path';
@Injectable()
export class MongoService {
  private path: string;

  constructor() {
    this.path = join(__dirname, 'credentials.txt');
  }

  async initMongo(url?: string): Promise<typeof mongoose> {
    let connectUrl: string;
    try {
      if (!url) {
        connectUrl = await this.getUrl();
      } else {
        connectUrl = url;
      }
    } catch (e) {
      return;
    }
    try {
      const conn = await mongoose.connect(connectUrl);
      return conn;
    } catch (e) {
      console.log('Mongo Connection Failed', e);
      return;
    }
  }

  async saveMongoUrl(url: string): Promise<string | null> {
    try {
      writeFileSync(this.path, url, 'utf-8');
    } catch (error) {
      console.error('Error saving Mongo URI:', error);
      return undefined;
    }
    return url;
  }

  async getUrl(): Promise<string | null> {
    if (existsSync(this.path)) {
      const existingUrl = readFileSync(this.path, 'utf-8').trim();
      if (!existingUrl) {
        return null;
      }
      return existingUrl;
    } else {
      return null;
    }
  }
}
