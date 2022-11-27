interface ConfigKeys {
    database: string,
    port: number,
    logDir: string
}

export const config: ConfigKeys = {
    database: process.env.DATABASE,
    port: Number(process.env.PORT) || 4001,
    logDir: process.env.APP_DIR
}
