import * as dotenv from 'dotenv'
dotenv.config()

import express, { Express } from "express";
import { config } from './config/config'
import router from './router';
import { connectDB } from './database/mongo-connection'
import morganMiddleware from './logger/morgan.logger';

const app: Express = express()
app.use(morganMiddleware)


app.use(router)

connectDB().then(() => {
    console.log("connected to mongo")
    app.listen(config.port || 4001, () => {
        console.log(`server started on ${config.port}`)
    })
}).catch(error => {
    console.error(error)
})

