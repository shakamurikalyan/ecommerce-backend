import express from 'express';
import { UserStore } from './classes/userStore';
import { MongoConnection } from './classes/mongo';
import RedisConnector from './classes/redisConnector'
import { TokenHandler } from './classes/tokenValidator';
import cors from "cors"
const expressPort = '8080';
class MainServer {
    app: any;
    port: any;
    constructor(port: string) {
        this.app = express();
        this.app.use(cors())
        this.port = port;
    }
    async initialize() {
        this.app.listen(this.port);
        console.log('server listening on ', this.port)
        await MongoConnection.initialization('mongodb+srv://kalyan:kalyan@cluster0.gk2rqbh.mongodb.net/?retryWrites=true&w=majority');
        console.log('mongo connected');
        await RedisConnector.initialise(`redis://localhost:6379`)
        console.log('redis connected');
        this.start()
    }
    async start() {
        this.app.get('/health', async (req: any, res: any) => {
            console.log(req.body)
            res.send(await UserStore.store(req.params));
        })
        this.app.get('/signIn', async (req: any, res: any) => {
            console.log('----request body', req.body)
            let response = await MongoConnection.addUser(req.body);
            if (response) {
                res.send({
                    success: true
                })
            } else {
                res.send({
                    success: false
                })
            }
        })
        this.app.get('/login', async (req: any, res: any) => {
            let response = await MongoConnection.findUser(req.body.number, req.body.password);
            if (response) {
                let token = await TokenHandler.generateToken();
                res.send({
                    success: true,
                    token: token
                })
            }
            else {
                res.send({
                    success: false,
                })
            }
        })
        this.app.get('/editUser', async (req: any, res: any) => {
            let tokenCheck = await TokenHandler.validateToken(req.body.token)
            if (tokenCheck) {
                let response = await MongoConnection.editUser(req.body.number, req.body.updatedData);
                if (response) {
                    res.send({
                        success: true,
                    })
                }
                else {
                    res.send({
                        success: false,
                    })
                }
            }
            else {
                res.send({
                    success: false,
                    message: 'tokenvalidation failed'
                })
            }
        })
    }
}

(async () => {
    let mainServer = new MainServer(expressPort);
    mainServer.initialize()
})()
