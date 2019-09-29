import process from 'process';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import { createConnection } from 'typeorm';

// import {devLog, commonLog} from './logging/core';
import jwtStrategy from './middleware/auth';
import { apolloServer } from './graphql';
import { Configurations } from './entities/configurations';

dotenv.config();
createConnection()
  .then(async connection => {
    const app = express();

    const PORT = process.env.SERVER_PORT || 3000;

    // Logging
    // app.use(devLog);
    // app.use(commonLog);
    app.use(bodyParser.json(), cors());

    let config = await Configurations.findOne();
    if (!config) {
      config = new Configurations();
      await config.save();
    }

    passport.use('jwt', jwtStrategy);
    app.use('/graphql', (req, res, next) => {
      passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (user) {
          req.user = user;
        }

        next();
      })(req, res, next);
    });

    app.use('/uploads', express.static('uploads'));

    const path = '/graphql';
    apolloServer.applyMiddleware({ app, path });

    app.listen(PORT, () => {
      console.log(`Listening on port: ${PORT}`);
    });
  })
  .catch(error => console.log(error));
