import * as dotenv from 'dotenv'
dotenv.config()
import morgan from 'morgan'

import express, { Express } from "express";
import { config } from './config/config'

const app: Express = express()
app.use(morgan('tiny'))

app.listen(config.port || 4001, () => {
    console.log(`server started on ${config.port}`)
})
