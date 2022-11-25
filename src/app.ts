import * as dotenv from 'dotenv'
dotenv.config()
import morgan from 'morgan'

import express, { Express } from "express";
import { config } from './config/config'
import router from './router';

const app: Express = express()
app.use(morgan('tiny'))
app.use(router)

app.listen(config.port || 4001, () => {
    console.log(`server started on ${config.port}`)
})
