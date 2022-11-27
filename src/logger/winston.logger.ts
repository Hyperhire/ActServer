import { config } from '../config/config';
import { createLogger, format, transports, Logger } from 'winston'


const options = {
    file: {
        level: "info",
        filename: `${config.logDir}/app.log`,
        handleExceptions: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        format: format.combine(
            format.timestamp(),
            format.json()
        ),
    },
    console: {
        level: "debug",
        handleExceptions: true,
        format: format.combine(
            format.colorize(),
            format.simple()
        ),
    },
};


export const logger: Logger = createLogger({
    transports: [
        new transports.File(options.file),
        new transports.Console(options.console)
    ],
    exitOnError: false
})
