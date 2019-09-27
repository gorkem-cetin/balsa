import { gql } from 'apollo-server-express';
import { BalsaFile } from '../../entities/balsaFile';
import shortid from 'shortid';
import { User } from '../../entities/user';
import { IsNull } from 'typeorm';
import { BehaviourLogger } from '../../logging/core';
import { BehaviourLog } from '../../entities/behaviourLog';

const logger = new BehaviourLogger();
function pickColor() {
  const colors = ['#ffe39f', '#9dead1', '#ffbab7', '#8fbdff', '#bee0ea', '#ead3fb', '#b7edff', '#a6d5ff'];

  return colors[Math.round(Math.random() * colors.length)];
}
const typeDefs = gql`
  extend type Mutation {
    createFolder(name: String, parentId: Int): File
    deleteFolder(id: Int!): File
    updateFolder(id: Int!, name: String, parentId: Int): File
  }

  extend type Query {
    allFolders(parentId: Int): [File!]
    onlyFolders(parentId: Int, exceptFolderId: Int): [File!]
    recentFolders: [File!]
    myFolders: [File!]
    Folder(id: Int!): File
    folderPath(id: Int): [File!]
  }
`;

const resolvers = {
  Mutation: {
    createFolder: async (_, { name, parentId }, context) => {
      const user = context.user;
      const newFolder = new BalsaFile();
      newFolder.color = pickColor();
      newFolder.isFolder = true;
      const folderId = shortid.generate();
      if (name) {
        newFolder.name = name;
      } else {
        newFolder.name = `Klasor.${folderId}`;
      }
      if (parentId) {
        const parent = await BalsaFile.findOne({ id: parentId });
        newFolder.parent = parent;
      }
      if (context.user && context.user.id) {
        const user = await User.findOne({ id: context.user.id });
        newFolder.user = user;
      }
      await newFolder.save();
      logger.log(user, newFolder, BehaviourLog.ACTION_CREATE_FOLDER);

      return newFolder;
    },
    updateFolder: async (_, { id, name, parentId }, context) => {
      const user = context.user;
      const folderToUpdate = await BalsaFile.findOne({ id });
      if (!folderToUpdate) {
        throw new Error('No Folder');
      }
      if (name) {
        folderToUpdate.name = name;
      }
      if (parentId) {
        const parent = await BalsaFile.findOne({ id: parentId });
        folderToUpdate.parent = parent;
      }
      if (context.user && context.user.id) {
        const user = await User.findOne({ id: context.user && context.user.id });
        folderToUpdate.user = user;
      }
      folderToUpdate.save();
      logger.log(user, folderToUpdate, BehaviourLog.ACTION_UPDATE_FOLDER);

      return folderToUpdate;
    },
    deleteFolder: async (_, { id }) => {
      const folderToDelete = await BalsaFile.findOne({ id });
      if (!folderToDelete) {
        throw new Error('No Folder');
      }
      await folderToDelete.remove();
      logger.log(user, folderToDelete, BehaviourLog.ACTION_DELETE_FOLDER, true);
      return folderToDelete;
    },
  },
  Query: {
    allFolders: async (_, { parentId }, context) => {
      const user = context.user;
      let qb = BalsaFile.getRepository().createQueryBuilder('file');
      qb = qb
        .leftJoinAndSelect('file.children', 'children')
        .leftJoinAndSelect('file.parent', 'parent')
        .leftJoinAndSelect('parent.contributors', 'asd')
        .leftJoinAndSelect('asd.user', 'parentContribUser')
        .leftJoinAndSelect('file.user', 'user')
        .leftJoinAndSelect('file.stars', 'stars')
        .leftJoinAndSelect('file.contributors', 'contributors')
        .leftJoinAndSelect('contributors.user', 'contributor')
        .leftJoinAndSelect('stars.user', 'starUser')
        .where('(user.id = :userId OR contributor.id = :userId)', { userId: user.id });
      if (parentId) {
        qb = qb.andWhere('parent.id = :parentId', { parentId });
      } else {
        qb = qb.andWhere('(user.id = :userId AND parent IS NULL) OR (contributor.id = :userId AND parent IS NULL) OR (contributor.id = :userId AND parent IS NOT NULL AND parentContribUser.id != :userId)', { userId: user.id })
      }

      const folders = await qb.getMany();


      return folders;
    },
    onlyFolders: async (_, { parentId, exceptFolderId }, context) => {
      let qb = BalsaFile.getRepository().createQueryBuilder('file');
      qb = qb
        .leftJoinAndSelect('file.children', 'children')
        .leftJoinAndSelect('file.parent', 'parent')
        .leftJoinAndSelect('parent.contributors', 'asd')
        .leftJoinAndSelect('asd.user', 'parentContribUser')
        .leftJoinAndSelect('file.user', 'user')
        .leftJoinAndSelect('file.stars', 'stars')
        .leftJoinAndSelect('file.contributors', 'contributors')
        .leftJoinAndSelect('contributors.user', 'contributor')
        .leftJoinAndSelect('stars.user', 'starUser')
        .where('file.isFolder = True')
        .andWhere('(user.id = :userId OR contributor.id = :userId)', { userId: context.user.id });

      if (exceptFolderId) {
        qb = qb.andWhere('file.id != :exceptFolderId', { exceptFolderId })
      }

      if (parentId) {
        qb = qb.andWhere('parent.id = :parentId', { parentId });
      } else {
        qb = qb.andWhere('(user.id = :userId AND parent IS NULL) OR (contributor.id = :userId AND parent IS NULL) OR (contributor.id = :userId AND parent IS NOT NULL AND parentContribUser.id != :userId)')
      }

      const folders = await qb.getMany();

      return folders;
    },
    Folder: async (_, { id }) => {
      const folder = await BalsaFile.findOne({ where: { id }, relations: ['children', 'parent', 'user'] });
      return folder;
    },
    folderPath: async (_, { id }) => {
      async function getAncestors(nodeId) {
        const node = await BalsaFile.findOne({ where: { id: nodeId }, relations: ['parent'] });
        if (node.parent) {
          const parents = await getAncestors(node.parent.id);
          return [...parents, node];
        } else {
          return [node];
        }
      }
      return id ? await getAncestors(id) : [];
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
