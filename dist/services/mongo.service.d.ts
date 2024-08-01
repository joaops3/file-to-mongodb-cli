import mongoose from 'mongoose';
export declare class MongoService {
    private path;
    constructor();
    initMongo(url?: string): Promise<typeof mongoose>;
    saveMongoUrl(url: string): Promise<string | null>;
    getUrl(): Promise<string | null>;
}
