import { connect } from "mongoose";
import { config } from '../config/config'

export async function connectDB() {
    await connect(config.database)
}