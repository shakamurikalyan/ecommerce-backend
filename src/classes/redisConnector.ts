import { createClient, RedisClientOptions, RedisClientType } from 'redis';

export default class RedisConnector {
    static connection: RedisClientType;
    static client: any;

    static async initialise(url:string) {
        let redisIOOpts: any = {};
        let redisClientOpts: any = {
            url: url
        };
        RedisConnector.connection = createClient(redisClientOpts);
        await RedisConnector.connection.connect();
    }

    static getAppRedisConnection() {
        return RedisConnector.connection;
    }
    static async redisFetch(matchPattern: string) {
        try {
            let redisRes = await RedisConnector.getAppRedisConnection().keys(matchPattern)
            return redisRes;
        } catch (e: any) {
            return e;
        }
    }
}
