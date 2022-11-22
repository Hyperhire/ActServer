interface ConfigKeys {
    database: string,
    port: number
}

export const config: ConfigKeys = {
    database: process.env.DATABASE,
    port: Number(process.env.PORT) || 4001
}
