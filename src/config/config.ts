interface ConfigKeys {
  dev: string;
  database: string;
  port: number;
  logDir: string;
  jwtKey: string;
  hashKey: string;
  JWT_EXPIRE_TIME_ACCESS: number;
  JWT_EXPIRE_TIME_REFRESH: number;
  MIN_WITHDRAW_AVAILABLE_AMOUNT: number;
  MAILER_EMAIL: string;
  MAILER_PASSWORD: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
}

export const config: ConfigKeys = {
  dev: process.env.NODE_ENV,
  database: process.env.DATABASE,
  port: Number(process.env.PORT) || 4001,
  logDir: process.env.APP_DIR,
  jwtKey: process.env.JWT_KEY,
  hashKey: process.env.HASH_KEY,
  JWT_EXPIRE_TIME_ACCESS: 60 * 30,
  JWT_EXPIRE_TIME_REFRESH: 60 * 60 * 24,
  MIN_WITHDRAW_AVAILABLE_AMOUNT: 500000,
  MAILER_EMAIL: process.env.MAILER_EMAIL,
  MAILER_PASSWORD: process.env.MAILER_PASSWORD,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: Number(process.env.REDIS_PORT)
};
