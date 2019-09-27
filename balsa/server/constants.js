import process from 'process';
import moment from 'moment';

export const MODE = process.env.NODE_ENV;
export const IS_DEV = MODE !== 'production';
export const IS_PRODUCTION = !IS_DEV;

export const SERVER_DOMAIN = process.env.SERVER_DOMAIN;
export const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN;
export const SERVER_PORT = process.env.SERVER_PORT;
export const CLIENT_PORT = process.env.CLIENT_PORT;
export const IS_SECURE = process.env.SSL;
export const HTML_SCHEMA = IS_SECURE ? 'https' : 'http';
export const SERVER_URL = `${HTML_SCHEMA}://${SERVER_DOMAIN}:${SERVER_PORT}`;
export const CLIENT_URL = `${HTML_SCHEMA}://${CLIENT_DOMAIN}${IS_PRODUCTION ? '' : ':' + CLIENT_PORT}`;
export const UPLOADS_DIR = process.env.UPLOADS_DIR;
export const BUILD_DATE = moment().format('YYYY.MM.DD-kk:mm');

export const SMTP_SERVICE_HOST = process.env.SMTP_SERVICE_HOST;
export const SMTP_SERVICE_PORT = process.env.SMTP_SERVICE_PORT;
export const SMTP_SERVICE_SECURE = process.env.SMTP_SERVICE_SECURE;
export const SMTP_SERVICE_DEBUG = process.env.SMTP_SERVICE_DEBUG || IS_DEV;
export const SMTP_SERVICE_USER_NAME = process.env.SMTP_SERVICE_USER_NAME;
export const SMTP_SERVICE_USER_PASSWORD = process.env.SMTP_SERVICE_USER_PASSWORD;

// NOTIFICATIONS
export const SHARED_WITH_ME = 'shared';
export const REPLIED_ME = 'replied';
export const MENTIONED_ME = 'mentioned';
export const MODIFIED_MY_DOCUMENT = 'modified';
export const PUBLISHED_DOCUMENT = 'published';
