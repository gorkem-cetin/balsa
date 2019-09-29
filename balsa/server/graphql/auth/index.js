import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import process from 'process';
import { gql, AuthenticationError, ValidationError, UserInputError, ForbiddenError } from 'apollo-server-express';
import { User } from '../../entities/user';
import { passwordStrongCheck } from '../../utils';
import { isAuthenticated, userAware } from './directiveResolvers';
import BaseStorage from '../../storage/base';
import { Like } from 'typeorm';
import Mailer from '../../mail/base';
import { ForgotPasswordCode } from '../../entities/forgotPasswordCode';
import uuidv4 from 'uuid/v4';
import { BalsaFile } from '../../entities/balsaFile';
import {UserInviteCode} from "../../entities/userInviteCode";
import {BehaviourLog} from "../../entities/behaviourLog";
import {BehaviourLogger} from "../../logging/core";
import {Configurations} from "../../entities/configurations";

const logger = new BehaviourLogger();

const SECRET = process.env.SECRET_KEY || 'SECRET';

const typeDefs = gql`
  directive @isAuthenticated on FIELD_DEFINITION
  directive @userAware on FIELD_DEFINITION

  enum ROLES {
    USER
    MANAGER
    ADMIN
  }

  extend type Mutation {
    register(email: String!, password: String!, firstName: String!, lastName: String!, code: String): Boolean
    authenticate(email: String!, password: String!): LoginResponse
    changePassword(oldPassword: String!, newPassword1: String!, newPassword2: String!): Boolean!
    editProfile(id: Int, email: String!, firstName: String!, lastName: String!, jobTitle: String, profilePhoto: Upload, role: String, status: String): Boolean!
    startForgotPassword(email: String!): Boolean!
    forgotPassword(code: String!, newPassword: String!): Boolean!
    inviteUser(data: [InviteCodeInput]): Boolean!
    removeUser(userId: Int!, passFilesTo: Int): Boolean!
    revokeInvitation(id: Int!): InviteCode!
  }

  extend type Query {
    allUsers(filterQuery: String): [User!]
    inviteToFileUserList(filterQuery: String, fileID: Int!): [User!]
    contributors(filterQuery: String, fileID: Int!): [User!]
    myProfile: User!
    checkToken: User
    invitedUser(code: String!): InviteCode!
    invitedUsers: [InviteCode!]
  }

  type User {
    id: Int!
    email: String!
    firstName: String!
    lastName: String!
    profilePhoto: String
    jobTitle: String
    files: [File!]
    createdAt: String
    role: String
    status: String
    fileCount: Int!
    fileContributorsCount: Int!
  }

  type LoginResponse {
    token: String!
    user: User!
  }
  
  type InviteCode {
    id: Int
    firstName: String
    lastName: String
    email: String!
    role: String
    status: String
    createdAt: String
  }
  
  input InviteCodeInput {
    firstName: String
    lastName: String
    email: String!
    role: String
  }
`;

const resolvers = {
  Mutation: {
    inviteUser: async (_, { data }, context) => {
      const user = context.user;

      for (const _data of data) {
        const email = _data.email;
        const firstName = _data.firstName;
        const lastName = _data.lastName;
        const role = _data.role;
        const existUserCheck = await User.findOne({ email });
        const existInvitationCheck = await UserInviteCode.findOne({ email });

        if (existUserCheck) {
          throw new ValidationError(`User with email (${email}) already exists.`)
        }

        if (existInvitationCheck) {
          throw new ValidationError(`Invitation with email (${email}) already exists.`)
        }

        const inviteData = new UserInviteCode();
        inviteData.firstName = firstName;
        inviteData.lastName = lastName;
        inviteData.email = email;
        inviteData.role = role;
        inviteData.inviteCode = uuidv4();
        await inviteData.save();

        logger.log(user, inviteData, BehaviourLog.ACTION_INVITE_USER);

        const mailer = new Mailer();
        mailer.sendMail('noreply@describe.im', inviteData.email, 'Invitation to Balsa',
          'invite', { inviteData, user, inviteLink: inviteData.inviteUrl() });
      }

      return true;
    },
    revokeInvitation: async (_, { id }, context) => {
      const user = context.user;
      const inviteCode = await UserInviteCode.findOne({ id });
      await inviteCode.remove();

      logger.log(user, inviteCode, BehaviourLog.ACTION_REVOKE_USER_INVITE, true);
      return inviteCode;
    },
    removeUser: async (_, { userId, passFilesTo }, context) => {
      const actor = context.user;

      const user = await User.findOne({ id: userId });
      if (passFilesTo) {
        const qb = BalsaFile.getRepository().createQueryBuilder('file');
        const newUser = await User.findOne({ id: passFilesTo });
        const files = await qb
          .leftJoinAndSelect('file.user', 'user')
          .where('user.id = :ownerId', { ownerId: user.id })
          .getMany();

        for (const file of files) {
          file.user = newUser;
          await file.save();
        }
      }

      await user.remove();
      logger.log(actor, user, BehaviourLog.ACTION_DELETE_USER, true);

      return true;
    },
    register: async (_, { email, password, firstName, lastName, code }) => {
      let inviteCode;
      if (code) {
        inviteCode = await UserInviteCode.findOne({ inviteCode: code });
        if (!inviteCode) {
          throw new ForbiddenError('Wrong code.')
        }
      }
      if (await User.findOne({ email: email })) {
        throw new ValidationError(`User with email (${email}) already exists.`)
      }
      const hashedPassword = await argon2.hash(password);
      const newUser = new User();
      newUser.email = email;
      newUser.password = hashedPassword;
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      if (inviteCode) {
        newUser.role = inviteCode.role;
      } else {
        newUser.role = User.ROLE_ADMIN;
      }
      await newUser.save();

      const configuration = await Configurations.findOne({ id: 1 });
      configuration.appInitialized = true;
      await configuration.save()

      logger.log(newUser, newUser, BehaviourLog.ACTION_REGISTER_USER);

      const mailer = new Mailer();
      mailer.sendMail('noreply@describe.im', newUser.email, 'Welcome to Balsa!', 'register', { user: newUser });
      if (inviteCode) {
        await inviteCode.remove();
        logger.log(newUser, inviteCode, BehaviourLog.ACTION_ACCEPT_USER_INVITE, true);
      }
      return true;
    },
    authenticate: async (_, { email, password }) => {
      const user = await User.findOne({ email: email });

      if (!user) {
        throw new AuthenticationError('No such user.');
      }

      const passwordCheck = await argon2.verify(user.password, password);

      if (!passwordCheck) {
        throw new AuthenticationError('Wrong password.');
      }

      const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1y' });
      logger.log(user, user, BehaviourLog.ACTION_LOGIN_USER);
      return {
        token: token,
        user: user,
      };
    },
    changePassword: async (_, { oldPassword, newPassword1, newPassword2 }, context) => {
      const user = context.user;

      const passwordCheck = await argon2.verify(user.password, oldPassword);

      if (!passwordCheck) {
        throw new ValidationError('Wrong password.');
      }

      if (newPassword1 !== newPassword2) {
        throw new ValidationError('New password fields are not matching.');
      }

      const passwordStrength = passwordStrongCheck(newPassword1);
      user.password = await argon2.hash(newPassword1);
      await user.save();

      logger.log(user, user, BehaviourLog.ACTION_PASSWORD_CHANGE_USER);

      return true;
    },
    startForgotPassword: async (_, { email }, context) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('No such user');
      }
      const forgotPasswordCode = new ForgotPasswordCode();
      forgotPasswordCode.user = user.id;
      forgotPasswordCode.code = uuidv4();
      await forgotPasswordCode.save();

      const mailer = new Mailer();
      mailer.sendMail('noreply@describe.im', email, `Balsa password reset`, 'passwordReset', {
        resetUrl: forgotPasswordCode.passwordChangeUrl(),
        user: user,
      });

      logger.log(user, user, BehaviourLog.ACTION_PASSWORD_RESET_START_USER);

      return true;
    },
    forgotPassword: async (_, { code, newPassword }, context) => {
      const forgotPasswordCode = await ForgotPasswordCode.findOne({ code }, { relations: ['user'] });

      if (!forgotPasswordCode || forgotPasswordCode.expired) {
        throw new Error('No such code');
      }
      const user = await forgotPasswordCode.user;

      user.password = await argon2.hash(newPassword);
      user.save();

      logger.log(user, user, BehaviourLog.ACTION_PASSWORD_RESET_USER);

      return true;
    },
    editProfile: async (_, { id, email, firstName, lastName, jobTitle, profilePhoto, role, status }, context) => {
      let user;
      const actor = context.user;
      if (id) {
        user = await User.findOne({ id });
      } else {
        user = context.user;
      }
      user.email = email;
      user.firstName = firstName;
      user.lastName = lastName;
      user.jobTitle = jobTitle;
      if (profilePhoto) {
        const storage = new BaseStorage();
        const { id, filename, mimetype, path } = await storage.store(profilePhoto, 'profile');
        user.profilePhoto = path;
      }
      if (role) {
        user.role = role;
      }
      if (status) {
        user.status = status;
      }
      user.save();

      logger.log(actor, user, BehaviourLog.ACTION_UPDATE_USER);

      return true;
    },
  },
  Query: {
    allUsers: async (_, { filterQuery }, context) => {
      const users = await User.find({
        where: filterQuery
          ? [
              { firstName: Like(`%${filterQuery}%`) },
              { lastName: Like(`%${filterQuery}%`) },
              { email: Like(`%${filterQuery}%`) },
            ]
          : undefined,
        take: 1000,
        relations: ['files', 'files.contributors'],
      });
      return users;
    },
    invitedUsers: async (_, { }, context) => {
      return await UserInviteCode.find();
    },
    inviteToFileUserList: async (_, { filterQuery, fileID }, context) => {
      const user = context.user;

      const file = await BalsaFile.findOne({ id: fileID }, { relations: ['user'] });

      let qb = User.getRepository().createQueryBuilder('user');
      qb = qb
        .leftJoin('user.contributions', 'contributions')
        .leftJoinAndSelect('contributions.file', 'file')
        .where('(:fileID != file.id OR contributions IS NULL)', { fileID: fileID })
        .andWhere('user.id != :userID AND user.id != :ownerID ', { userID: user.id, ownerID: file.user.id });

      if (filterQuery) {
        qb = qb.andWhere(
          '(LOWER(user.firstName) LIKE :query OR LOWER(user.lastName) LIKE :query OR LOWER(user.email) LIKE :query)',
          {
            query: `%${filterQuery.toLocaleLowerCase()}%`,
          },
        );
      }
      const users = await qb.getMany();
      // TODO: needing this is awkard, has to replace with exact sql query
      /* return users.map((user, index) => {
        console.log('USER', user.contributions, user.contributions.includes(fileID));
        if (!user.contributions.includes(fileID)) {
          return user;
        }
      });*/

      return users;
    },
    contributors: async (_, { filterQuery, fileID }, context) => {
      const user = context.user;

      let qb = User.getRepository().createQueryBuilder('user');
      qb = qb
        .leftJoin('user.contributions', 'contributions')
        .leftJoin('contributions.file', 'file')
        .leftJoin('contributions.user', 'contributor')
        .where('file.id = :fileID', { fileID: fileID })
        .andWhere('user.id != :userID', { userID: user.id });

      if (filterQuery) {
        qb = qb.andWhere(
          '(LOWER(user.firstName) LIKE :query OR LOWER(user.lastName) LIKE :query OR LOWER(user.email) LIKE :query)',
          {
            query: `%${filterQuery.toLocaleLowerCase()}%`,
          },
        );
      }
      const users = await qb.getMany();
      // TODO: needing this is awkard, has to replace with exact sql query
      /* return users.map((user, index) => {
        console.log('USER', user.contributions, user.contributions.includes(fileID));
        if (!user.contributions.includes(fileID)) {
          return user;
        }
      });*/

      return users;
    },
    myProfile: async (_, {}, context) => {
      return context.user;
    },
    checkToken: async (_, __, context) => {
      const user = context.user;
      return user;
    },
    invitedUser: async (_, { code }, context) => {
      return await UserInviteCode.findOne({ inviteCode: code })
    },
  },
};

const directives = {
  isAuthenticated,
  userAware,
};

module.exports = {
  typeDefs,
  resolvers,
  directives,
};
