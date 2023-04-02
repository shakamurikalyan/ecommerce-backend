import express from 'express';
import { UserStore } from './classes/userStore';
import { MongoConnection } from './classes/mongo';
import RedisConnector from './classes/redisConnector'
import { TokenHandler } from './classes/tokenValidator';
import cors from "cors"
import multer from 'multer';
import fs from 'fs/promises';

const expressPort = '8080';
class MainServer {
    app: any;
    port: any;
    multer!: multer.Multer;
    constructor(port: string) {
        this.app = express();
        this.app.use(cors())
        this.app.use(express.json())
        this.multer = multer();
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
        this.app.post('/health', async (req: any, res: any) => {
            console.log(req.body)
            res.send(await UserStore.store(req.body));
        })
        this.app.post('/signin', async (req: any, res: any) => {
            try {
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
            } catch (e: any) {
                res.send({
                    success: false
                })
            }
        })
        this.app.post('/login', async (req: any, res: any) => {
            try {
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
            } catch (e: any) {
                res.send({
                    success: false
                })
            }
        })
        this.app.post('/edituser', async (req: any, res: any) => {
            try {
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
            } catch (e: any) {
                res.send({
                    success: false
                })
            }
        })
        this.app.post('/addproduct', this.multer.any(), async (req: any, res: any) => {
            try {
                let tokenCheck = await TokenHandler.validateToken(req.body.token)
                if (tokenCheck) {
                    await fs.writeFile(`./images/${req.body.name}.png`, req.files[0].buffer)
                    let response = await MongoConnection.addProduct(req.body);
                    if (response) {
                        res.send({
                            success: true
                        })
                    } else {
                        res.send({
                            success: false
                        })
                    }
                }
                else {
                    res.send({
                        success: false,
                        message: 'tokenvalidation failed'
                    })
                }
            } catch (e: any) {
                res.send({
                    success: false
                })
            }
        })
        this.app.post('/fetchproducts', async (req: any, res: any) => {
            try {
                let tokenCheck = await TokenHandler.validateToken(req.body.token)
                if (tokenCheck) {

                    let productsList: any = await MongoConnection.findAllProducts();
                    console.log(productsList)
                    for (let i = 0; i < productsList.length; i++) {
                        productsList[i].push(await fs.readFile(`./images/${productsList[i].name}.png`))
                    }
                    res.send({
                        success: true,
                        data: productsList
                    })

                }
                else {
                    res.send({
                        success: false,
                        message: 'tokenvalidation failed'
                    })
                }
            } catch (e: any) {
                res.send({
                    success: false
                })
            }
        })
        this.app.post('/fetchorder', async (req: any, res: any) => {
            try {
                let tokenCheck = await TokenHandler.validateToken(req.body.token)
                if (tokenCheck) {
                    let response = await MongoConnection.findAllOrders();
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
            } catch (e: any) {
                res.send({
                    success: false
                })
            }
        })
    }
}

(async () => {
    let mainServer = new MainServer(expressPort);
    mainServer.initialize()
})()
