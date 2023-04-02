import { v4 as uuidv4 } from 'uuid';
import RedisConnector from './redisConnector';
export class TokenHandler {
    static async generateToken(): Promise<string> {
        let client = RedisConnector.getAppRedisConnection();
        let key = uuidv4();
        client.set(key, '', { 'EX': 60 * 60 * 24 },)
        return key;
    }
    static async validateToken(matchPattern: string) {
        try {
            let redisRes = await RedisConnector.getAppRedisConnection().keys(matchPattern);
            return redisRes;
        }
        catch (e: any) {
            console.log(e)
            return false;
        }
    }
}