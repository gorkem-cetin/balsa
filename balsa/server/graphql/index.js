import { ApolloServer } from 'apollo-server-express';
import { merge } from 'lodash';
import { typeDefs as BaseType } from './base';
import { typeDefs as AuthTypes, resolvers as AuthResolvers, directives as AuthDirectives } from './auth';
import { typeDefs as FileTypes, resolvers as FileResolvers } from './file';
import { typeDefs as FolderTypes, resolvers as FolderResolvers } from './folder';
import { typeDefs as ConfigTypes, resolvers as ConfigResolvers } from './config';
import { typeDefs as LogTypes, resolvers as LogResolvers } from './logging';
import { typeDefs as UserUploadTypes, resolvers as UserUploadResolvers } from './userUpload';
import { IS_DEV } from '../constants';

const resolvers = {};
const directives = {};

const apolloServer = new ApolloServer({
  playground: IS_DEV,
  introspection: IS_DEV,
  typeDefs: [BaseType, AuthTypes, FileTypes, FolderTypes, ConfigTypes, LogTypes, UserUploadTypes],
  resolvers: merge(
    resolvers,
    AuthResolvers,
    FileResolvers,
    FolderResolvers,
    ConfigResolvers,
    LogResolvers,
    UserUploadResolvers,
  ),
  schemaDirectives: merge(directives, AuthDirectives),
  context: ({ req }) => ({
    user: req.user,
  }),
});

module.exports.apolloServer = apolloServer;
