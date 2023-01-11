import * as dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import { config } from "./config/config";
import router from "./router";
import { connectDB } from "./database/mongo-connection";
import morganMiddleware from "./logger/morgan.logger";
import swagger from "./utils/swagger";
import cors from "cors";
import {
  subscriptionFirst,
  subscriptionTenth,
  subscriptionTwenteith
} from "./utils/scheduler";

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(morganMiddleware);

app.use(
  "/api-docs",
  swagger.swaggerUi.serve,
  swagger.swaggerUi.setup(swagger.specs)
);

app.use(router);

connectDB()
  .then(() => {
    console.log("connected to mongo for", config.KAS_CHAIN_ID);
    app.listen(config.PORT || 4001, () => {
      console.log(`server started on ${config.PORT}`);
    });

    // 1일날 정기결제 처리
    subscriptionFirst;

    // 10일날 정기결제 처리
    subscriptionTenth;

    // 20일날 정기결제 처리
    subscriptionTwenteith;
  })
  .catch(error => {
    console.error(error);
  });
