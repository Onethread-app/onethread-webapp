const Joi = require('@hapi/joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string()
        .allow(['development', 'production', 'test', 'local'])
        .default('development'),
    PORT: Joi.number().default(4040),
    MONGOOSE_DEBUG: Joi.boolean().when('NODE_ENV', {
        is: Joi.string().equal('development'),
        then: Joi.boolean().default(true),
        otherwise: Joi.boolean().default(false),
    }),

    JWT_ACCESS_TOKEN: Joi.string()
        .required()
        .description('JWT Access token Secret required to sign'),
    JWT_REFRESH_TOKEN: Joi.string()
        .required()
        .description('JWT Refresh token required to sign'),
    JWT_EXPIRATION: Joi.string()
        .required()
        .description('JWT access token time expire'),
    JWT_REFRESH_EXPIRATION: Joi.string()
        .required()
        .description('JWT refresh token expired'),
    MONGO_HOST: Joi.string().required().description('Mongo DB host url'),
    MONGO_PORT: Joi.number().default(27017),
    REDIS_HOST: Joi.string().required().description('Redis DB host url'),
    REDIS_PASSWORD: Joi.string().required(),
    REDIS_PORT: Joi.number(),
    EMAIL_ADDRESS: Joi.string()
        .required()
        .description('email address required'),
    EMAIL_PASSWORD: Joi.string().required().description('password required'),

    INSTANCE_LOCATOR: Joi.string()
        .required()
        .description('INSTANCE_LOCATOR required'),
    PUSHER_KEY: Joi.string().required().description('PUSHER_KEY required'),
    PUSHER_CHANNEL_CLUSTER: Joi.string()
        .required()
        .description('PUSHER_CHANNEL_CLUSTER required'),
    AWS_ACCESS_KEY: Joi.string()
        .required()
        .description('AWS credential required'),
    AWS_SECRET_ACCESS_KEY: Joi.string()
        .required()
        .description('AWS secret key required'),
    AWS_SES_KEY: Joi.string()
        .required()
        .description('AWS IAM SES key requires'),
    AWS_SES_ACCESS_KEY: Joi.string()
        .required()
        .description('AWS IAM SES secret key required'),
    SES_REGION: Joi.string().required().description('SES region required'),
    S3_REGION: Joi.string().required().description('S3 region required'),
    BUCKET_NAME: Joi.string().required().description('Bucket Name required'),
    PUSHER_CHANNEL_APP_ID: Joi.string()
        .required()
        .description('PUSHER_CHANNEL_APP_ID required'),
    PUSHER_CHANNEL_KEY: Joi.string()
        .required()
        .description('PUSHER_CHANNEL_KEY required'),
    PUSHER_CHANNEL_SECRET: Joi.string()
        .required()
        .description('PUSHER_CHANNEL_SECRET required'),
    PUSHER_CHANNEL_CLUSTER: Joi.string()
        .required()
        .description('PUSHER_CHANNEL_CLUSTER required'),
    APM_SERVICE_NAME: Joi.string()
        .required()
        .description('APM_SERVICE_NAME required'),
    APM_TOKEN: Joi.string().required().description('APM_TOKEN required'),
    APM_URL: Joi.string().required().description('APM_URL required'),
})
    .unknown()
    .required();

const {value: envVars} = Joi.validate(process.env, envVarsSchema);

const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongooseDebug: envVars.MONGOOSE_DEBUG,
    accessTokenSecret: envVars.JWT_ACCESS_TOKEN,
    refreshTokenSecret: envVars.JWT_REFRESH_TOKEN,
    accessTokenExpire: envVars.JWT_EXPIRATION,
    refreshTokenExpire: envVars.JWT_REFRESH_EXPIRATION,
    mongo: {
        host: envVars.MONGO_HOST,
        port: envVars.MONGO_PORT,
    },
    redis: {
        host: envVars.REDIS_HOST,
        port: envVars.REDIS_PORT,
        password: envVars.REDIS_PASSWORD,
    },
    // pusherChanel: {
    //   appid: envVars.PUSHER_CHANNEL_APPID,
    //   key: envVars.PUSHER_CHANNEL_KEY,
    //   secret: envVars.PUSHER_CHANNEL_SECRET,
    //   cluster: envVars.PUSHER_CHANNEL_CLUSTER,
    // },
    emailAddress: envVars.EMAIL_ADDRESS,
    emailPassword: envVars.EMAIL_PASSWORD,
    awsAccessKey: envVars.AWS_ACCESS_KEY,
    awsSecretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
    awsSesAccessKey: envVars.AWS_SES_KEY,
    awsSesSecretKey: envVars.AWS_SES_ACCESS_KEY,
    sesRegion: envVars.SES_REGION,
    s3Region: envVars.S3_REGION,
    bucketName: envVars.BUCKET_NAME,
    PUSHER_CHANNEL_APP_ID: envVars.PUSHER_CHANNEL_APP_ID,
    PUSHER_CHANNEL_KEY: envVars.PUSHER_CHANNEL_KEY,
    PUSHER_CHANNEL_SECRET: envVars.PUSHER_CHANNEL_SECRET,
    PUSHER_CHANNEL_CLUSTER: envVars.PUSHER_CHANNEL_CLUSTER,
    APM_SERVICE_NAME: envVars.APM_SERVICE_NAME,
    APM_TOKEN: envVars.APM_TOKEN,
    APM_URL: envVars.APM_URL,
};

module.exports = config;
