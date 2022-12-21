interface ConfigKeys {
  database: string;
  port: number;
  logDir: string;
  jwtKey: string;
  hashKey: string;
  JWT_EXPIRE_TIME_ACCESS: number;
  JWT_EXPIRE_TIME_REFRESH: number;
}

export const config: ConfigKeys = {
  database: process.env.DATABASE,
  port: Number(process.env.PORT) || 4001,
  logDir: process.env.APP_DIR,
  jwtKey: process.env.JWT_KEY,
  hashKey: "somethingsecret", //Todo
  JWT_EXPIRE_TIME_ACCESS: 60 * 60 * 24,
  JWT_EXPIRE_TIME_REFRESH: 60 * 60 * 24 * 2
};
