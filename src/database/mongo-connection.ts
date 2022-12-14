import { connect } from "mongoose";
import { config } from '../config/config'

export async function connectDB() {
    const options = {
        ignoreUndefined: true,
    }
    await connect(config.database, options)
}