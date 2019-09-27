import { gql } from 'apollo-server-express';
import { BehaviourLogger } from '../../logging/core';
import { BehaviourLog } from '../../entities/behaviourLog';

const logger = new BehaviourLogger();

const typeDefs = gql`
  extend type Query {
    activities(first: Int, skip: Int): [BehaviourLog]
    activitiesMeta: Meta
    allLogs: [BehaviourLog]
  }

  type Meta {
    count: Int
  }

  type BehaviourLog {
    id: Int!
    action: String!
    objectType: String!
    actor: User!
    data: String
    createdAt: String!
    affectedUsers: [User]
    file: File
    configuration: Configuration
    contributor: Contributor
    star: Star
    user: User
  }
`;

const resolvers = {
  Mutation: {},
  Query: {
    allLogs: async (_, __, context) => {
      const user = context.user;

      const qb = BehaviourLog.getRepository().createQueryBuilder('log');

      const logs = await qb
        .leftJoinAndSelect('log.actor', 'actor')
        .leftJoinAndSelect('log.affectedUsers', 'affectedUsers')
        .leftJoinAndSelect('log.file', 'file')
        .leftJoinAndSelect('log.configuration', 'configuration')
        .leftJoinAndSelect('log.contributor', 'contributor')
        .leftJoinAndSelect('log.star', 'star')
        .leftJoinAndSelect('log.user', 'user')
        .where('(actor.id = :userid OR affectedUsers.id = :userid)', { userid: user.id })
        .orderBy('log.createdAt', 'DESC', 'NULLS FIRST')
        .getMany();

      return logs;
    },
    activities: async (_, { first, skip }, context) => {
      const user = context.user;

      let qb = BehaviourLog.getRepository().createQueryBuilder('log');
      qb = qb
        .leftJoinAndSelect('log.actor', 'actor')
        .leftJoinAndSelect('log.affectedUsers', 'affectedUsers')
        .leftJoinAndSelect('log.file', 'file')
        .leftJoinAndSelect('file.user', 'fileUser')
        .leftJoinAndSelect('log.star', 'star')
        .leftJoinAndSelect('star.user', 'starUser')
        .leftJoinAndSelect('star.file', 'starFile')
        .leftJoinAndSelect('log.user', 'user')
        .leftJoinAndSelect('log.contributor', 'contributor')
        .leftJoinAndSelect('contributor.user', 'contributorUser')
        .leftJoinAndSelect('contributor.file', 'contributorFile')
        .leftJoinAndSelect('log.userInviteCode', 'userInviteCode')
        .where('(actor.id = :userid OR affectedUsers.id = :userid)', { userid: user.id })
        .andWhere('log.action IN (:...actions)', { actions: BehaviourLog.ACTIVITY_LOG_ACTIONS })
        .andWhere(
          '(log.user IS NOT NULL OR log.file IS NOT NULL OR log.configuration IS NOT NULL OR log.contributor IS NOT NULL OR log.star IS NOT NULL or log.userInviteCode IS NOT NULL)',
        )
        .orderBy('log.createdAt', 'DESC', 'NULLS FIRST');
      if (first) {
        qb = qb.take(first);
      }
      if (skip) {
        qb = qb.skip(skip);
      }
      const logs = await qb.getMany();

      return logs;
    },
    activitiesMeta: async (_, __, context) => {
      const user = context.user;

      let qb = BehaviourLog.getRepository().createQueryBuilder('log');

      qb = qb
        .leftJoinAndSelect('log.actor', 'actor')
        .leftJoinAndSelect('log.affectedUsers', 'affectedUsers')
        .leftJoinAndSelect('log.file', 'file')
        .leftJoinAndSelect('file.user', 'fileUser')
        .leftJoinAndSelect('log.star', 'star')
        .leftJoinAndSelect('star.user', 'starUser')
        .leftJoinAndSelect('star.file', 'starFile')
        .leftJoinAndSelect('log.user', 'user')
        .leftJoinAndSelect('log.contributor', 'contributor')
        .leftJoinAndSelect('contributor.user', 'contributorUser')
        .leftJoinAndSelect('contributor.file', 'contributorFile')
        .leftJoinAndSelect('log.userInviteCode', 'userInviteCode')
        .where('(actor.id = :userid OR affectedUsers.id = :userid)', { userid: user.id })
        .andWhere('log.action IN (:...actions)', { actions: BehaviourLog.ACTIVITY_LOG_ACTIONS })
        .andWhere(
          '(log.user IS NOT NULL OR log.file IS NOT NULL OR log.configuration IS NOT NULL OR log.contributor IS NOT NULL OR log.star IS NOT NULL or log.userInviteCode IS NOT NULL)',
        )
        .orderBy('log.createdAt', 'DESC', 'NULLS FIRST');
      const count = await qb.getCount();

      return { count };
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
