import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

const dbs = [
  {
    name: process.env.DB_NAME || 'default',
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    synchronize: true,
    logging: false,
    username: process.env.DB_USERNAME || 'balsa',
    password: process.env.DB_PASSWORD || 'balsa',
    database: process.env.DB_DATABASE_NAME || 'balsa',
    entities: ['./entities/*.{ts,js}'],
    migrations: ['./migrations/**/*.ts', './migrations/**/*.js'],
    subscribers: ['./subscribers/**/*.ts', './subscribers/**/*.js'],
    cli: {
      entitiesDir: './models',
      migrationsDir: './migrations',
      subscribersDir: './subscribers',
    },
  },
];

if (process.env.NODE_ENV !== 'dev') {
  dbs.push({
      name: process.env.TEST_DB_NAME || 'test',
      type: process.env.TEST_DB_TYPE || 'postgres',
      host: process.env.TEST_DB_HOST || 'db',
      port: process.env.TEST_DB_PORT || 5432,
      synchronize: true,
      logging: false,
      dropSchema: true,
      username: process.env.TEST_DB_USERNAME || 'balsa',
      password: process.env.TEST_DB_PASSWORD || 'balsa',
      database: process.env.TEST_DB_DATABASE_NAME || 'balsa_test',
      entities: ['./models/**/*.ts', './models/**/*.js'],
      migrations: ['./migrations/**/*.ts', './migrations/**/*.js'],
      subscribers: ['./subscribers/**/*.ts', './subscribers/**/*.js'],
      cli: {
        entitiesDir: './models',
        migrationsDir: './migrations',
        subscribersDir: './subscribers',
      },
    })
}

module.exports = dbs;
