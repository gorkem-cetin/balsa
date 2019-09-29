import { gql } from 'apollo-server-express';
import { VERSION } from '../../constants';
import {Configurations} from "../../entities/configurations";
import {UserConfigurations} from "../../entities/userConfigurations";

const typeDefs = gql`
  extend type Mutation {
    updateConfigurations(data: ConfigurationInput!): Configuration! 
    updateUserConfigurations(data: UserConfigurationInput!): UserConfiguration! 
  }
    
  extend type Query {
    version: String!
    configurations: Configuration!
    userConfigurations: UserConfiguration!
  }
  
  input ConfigurationInput {
    copyLink: Boolean
  }
  
  type Configuration {
    id: Int
    copyLink: Boolean
    appInitialized: Boolean
  }
  
  input UserConfigurationInput {
    notifyMeOnShare: Boolean
    notifyMeOnReply: Boolean
    notifyMeOnMention: Boolean
    notifyMeOnModify: Boolean
  }
  
  type UserConfiguration {
    id: Int
    notifyMeOnShare: Boolean
    notifyMeOnReply: Boolean
    notifyMeOnMention: Boolean
    notifyMeOnModify: Boolean
  }
`;

const resolvers = {
  Query: {
    version: async () => {
      return VERSION;
    },
    configurations: async () => {
      return await Configurations.findOne({ id: 1 })
    },
    userConfigurations: async (_, { __ },  context) => {
      const user = context.user;
      let config = await UserConfigurations.findOne({ user });
      if (config) {
        return config;
      } else {
        config = new UserConfigurations();
        config.user = user;
        await config.save();
        return config;
      }
    }
  },
  Mutation: {
    updateConfigurations: async (_, { data }, context) => {
      const config = await Configurations.findOne({ id: 1 });
      Object.assign(config, data);
      await config.save();
      return config;
    },
    updateUserConfigurations: async (_, { data }, context) => {
      const user = context.user;

      let config = await UserConfigurations.getRepository().createQueryBuilder('config')
        .leftJoinAndSelect('config.user', 'user')
        .where('user.id = :userid', { userid: user.id })
        .getOne();

      if (!config) {
        config = new UserConfigurations();
        config.user = user;
      }

      Object.assign(config, data);
      await config.save();

      return config;
    }
  }
};

module.exports = {
  typeDefs,
  resolvers,
};
