import { gql, AuthenticationError } from 'apollo-server-express';
import BaseStorage from '../../storage/base';
import { UserUpload } from '../../entities/userUpload';

const typeDefs = gql`
  extend type Mutation {
    uploadFile(file: Upload): UserUpload
  }

  type UserUpload {
    id: Int!
    file: String
    createdAt: String
  }
`;

const resolvers = {
  Mutation: {
    uploadFile: async (_, { file }, context) => {
      if (!context.user) {
        throw new AuthenticationError();
      }
      if (!file) {
        throw new Error('No File');
      }
      const storage = new BaseStorage();
      const { id, filename, mimetype, path } = await storage.store(file, 'userUploads');
      const userUpload = new UserUpload();
      userUpload.file = path;
      await userUpload.save();

      return await UserUpload.findOne({ id: userUpload.id });
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
