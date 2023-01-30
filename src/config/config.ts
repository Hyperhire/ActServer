interface ConfigKeys {
    isDev: boolean;
    PORT: number;
    DATABASE: string;
    LOG_DIR: string;
    JWT_KEY: string;
    HASH_KEY: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    KAKAO_CLIENT_ID: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_CREDENTIAL: string;
    NAVER_CLIENT_ID: string;
    NAVER_CLIENT_SECRET: string;
    APPLE_CLIENT_ID: string;
    APPLE_KEY_ID: string;
    APPLE_TEAM_ID: string;
    APPLE_SECRET_KEY: string;
    REDIS_PASSWORD: string;
    KAS_CHAIN_ID: string;
    KAS_ACCESS_KEY: string;
    KAS_SECRET_ACCESS_KEY: string;
    KAS_AUTHORIZATION: string;
    KAS_STORAGE_KRN: string;
    KAS_NFT_CONTRACT_ADDRESS: string;
    EMAIL_VERIFICATION_TIME: number;
    JWT_EXPIRE_TIME_ACCESS: number;
    JWT_EXPIRE_TIME_REFRESH: number;
    MIN_WITHDRAW_AVAILABLE_AMOUNT: number;
    MAILER_EMAIL: string;
    MAILER_PASSWORD: string;
    KAKAOPAY_SINGLE_PAYMENT_CID: string;
    KAKAOPAY_SUBSCRIPTION_PAYMENT_CID: string;
    KAKAO_ADMIN_KEY: string;
    AWS_ACCESS_REGION: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_S3_BUCKET: string;
    AWS_S3_IMAGE_LIMIT: number;
}

const isDev = process.env.NODE_ENV === "production" ? false : true;

export const config: ConfigKeys = {
    isDev: isDev,
    PORT: Number(process.env.PORT) || 4001,
    LOG_DIR: process.env.APP_DIR,
    JWT_KEY: process.env.JWT_KEY,
    HASH_KEY: process.env.HASH_KEY,
    DATABASE: isDev ? process.env.TEST_DATABASE : process.env.DATABASE,
    REDIS_HOST: isDev ? process.env.TEST_REDIS_HOST : process.env.REDIS_HOST,
    REDIS_PORT:
        Number(isDev ? process.env.TEST_REDIS_HOST : process.env.REDIS_PORT) ||
        6379,
    REDIS_PASSWORD: isDev
        ? process.env.TEST_REDIS_PASSWORD
        : process.env.REDIS_PASSWORD,
    KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID,
    GOOGLE_CLIENT_ID: isDev
        ? process.env.GOOGLE_CLIENT_ID
        : process.env.TEST_GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_CREDENTIAL: isDev
        ? process.env.GOOGLE_CLIENT_CREDENTIAL
        : process.env.TEST_GOOGLE_CLIENT_CREDENTIAL,
    NAVER_CLIENT_ID: isDev
        ? process.env.NAVER_CLIENT_ID
        : process.env.TEST_NAVER_CLIENT_ID,
    NAVER_CLIENT_SECRET: isDev
        ? process.env.NAVER_CLIENT_SECRET
        : process.env.TEST_NAVER_CLIENT_SECRET,
    APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
    APPLE_KEY_ID: process.env.APPLE_KEY_ID,
    APPLE_TEAM_ID: process.env.APPLE_TEAM_ID,
    APPLE_SECRET_KEY: process.env.APPLE_SECRET_KEY,
    KAS_CHAIN_ID: isDev
        ? process.env.TEST_KAS_CHAIN_ID
        : process.env.KAS_CHAIN_ID,
    KAS_ACCESS_KEY: isDev
        ? process.env.TEST_KAS_ACCESS_KEY
        : process.env.KAS_ACCESS_KEY,
    KAS_SECRET_ACCESS_KEY: isDev
        ? process.env.TEST_KAS_SECRET_ACCESS_KEY
        : process.env.KAS_SECRET_ACCESS_KEY,
    KAS_AUTHORIZATION: isDev
        ? process.env.TEST_KAS_AUTHORIZATION
        : process.env.KAS_AUTHORIZATION,
    KAS_STORAGE_KRN: isDev
        ? process.env.TEST_KAS_STORAGE_KRN
        : process.env.KAS_STORAGE_KRN,
    KAS_NFT_CONTRACT_ADDRESS: isDev
        ? process.env.TEST_KAS_NFT_CONTRACT_ADDRESS
        : process.env.KAS_NFT_CONTRACT_ADDRESS,
    KAKAOPAY_SINGLE_PAYMENT_CID: isDev
        ? process.env.TEST_KAKAOPAY_SINGLE_PAYMENT_CID
        : process.env.KAKAOPAY_SINGLE_PAYMENT_CID,
    KAKAOPAY_SUBSCRIPTION_PAYMENT_CID: isDev
        ? process.env.TEST_KAKAOPAY_SUBSCRIPTION_PAYMENT_CID
        : process.env.KAKAOPAY_SUBSCRIPTION_PAYMENT_CID,
    KAKAO_ADMIN_KEY: isDev
        ? process.env.TEST_KAKAO_ADMIN_KEY
        : process.env.KAKAO_ADMIN_KEY,
    AWS_ACCESS_REGION: isDev
        ? process.env.TEST_AWS_ACCESS_REGION
        : process.env.AWS_ACCESS_REGION,
    AWS_ACCESS_KEY_ID: isDev
        ? process.env.TEST_AWS_ACCESS_KEY_ID
        : process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: isDev
        ? process.env.TEST_AWS_SECRET_ACCESS_KEY
        : process.env.AWS_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET: isDev
        ? process.env.TEST_AWS_S3_BUCKET
        : process.env.AWS_S3_BUCKET,
    AWS_S3_IMAGE_LIMIT: 1024 * 1024 * 5,
    EMAIL_VERIFICATION_TIME: 60 * 30,
    JWT_EXPIRE_TIME_ACCESS: 60 * 30,
    JWT_EXPIRE_TIME_REFRESH: 60 * 60 * 24,
    MIN_WITHDRAW_AVAILABLE_AMOUNT: 0,
    MAILER_EMAIL: process.env.MAILER_EMAIL,
    MAILER_PASSWORD: process.env.MAILER_PASSWORD,
};
