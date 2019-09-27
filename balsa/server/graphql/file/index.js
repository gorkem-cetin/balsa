import { gql } from 'apollo-server-express';
import { BalsaFile } from '../../entities/balsaFile';
import { Contributor } from '../../entities/contributor';
import { Comment } from '../../entities/comment';
import { User } from '../../entities/user';
import uuidv4 from 'uuid/v4';
import { cloneDeep } from 'lodash';
import { Star } from '../../entities/star';
import Fuse from 'fuse.js';
import stripHtml from 'string-strip-html';
import { EmailNotifier, highlighter } from '../../utils';
import { BehaviourLogger } from '../../logging/core';
import { BehaviourLog } from '../../entities/behaviourLog';
import { EmailNotifications } from '../../entities/emailNotifications';
import {Conversation} from "../../entities/conversation";

const logger = new BehaviourLogger();

const typeDefs = gql`
  extend type Mutation {
    searchFile(query: String!): [SearchResponse!]
    createFile(content: String, folderId: Int): File
    deleteFile(id: Int!): File
    updateFile(
      id: Int!
      color: String
      parentId: Int
      name: String
      content: String
      contentHtml: String
      cursorPosition: Int
      defaultPermissionLevel: String
    ): File
    duplicateFile(id: Int!, name: String, folderId: Int, keepContributors: Boolean): File
    giveFilePermission(fileID: Int!, emails: [String!], permissionLevel: String): Boolean
    dropFilePermission(fileID: Int!, email: String!): Boolean
    updateFilePermission(fileID: Int!, email: String!, permissionLevel: String!): Boolean
    starFile(fileId: Int!): File!
    createComment(conversationUuid: String, fileId: Int, text: String): Comment
    createConversation(fileId: Int!, uuid: String!): Conversation
    deleteConversation(fileId: Int!, uuid: String!): Conversation
    mentionUser(fileId: Int!, userId: Int!): Boolean
  }

  extend type Query {
    allFiles: [File!]
    recentFiles: [File!]
    myFiles: [File!]
    starredFiles: [File!]
    File(id: Int!, inviteCode: String, publicViewCode: String, log: Boolean): File
    conversation(id: Int, uuid: String): Conversation
    contributor(inviteCode: String): Contributor
    getFilePublicUrl(id: Int!): String!
  }

  type File {
    id: Int!
    color: String
    name: String!
    content: String!
    contentHtml: String
    cursorPosition: Int
    user: User
    createdAt: String
    updatedAt: String
    readAt: String
    contributors: [Contributor]
    lastEditor: Contributor
    nonMeContributors: [User] @userAware
    isStarred: Boolean @userAware
    hasWritePermission: Boolean @userAware
    parent: File
    children: [File!]
    isFolder: Boolean
    getUrl: String
    comments: [Comment!]
  }

  type Contributor {
    id: Int!
    email: String!
    user: User
    file: File!
    isAnon: Boolean!
    permissionLevel: String!
    readFileAt: String
    updatedFileAt: String
  }

  type SearchResponse {
    file: File!
    highlight: String
    highlightedField: String
  }

  type Star {
    id: Int!
    user: User
    file: File
    createdAt: String
  }

  type Comment {
    id: Int!
    from: Int
    to: Int
    text: String
    file: File
    user: User
    createdAt: String
    conversation: Conversation
  }

  type Conversation {
    id: Int!
    uuid: String!
    file: File
    comments: [Comment]
    createdAt: String
  }
`;

const inheritPermissions = async (folderId, newFile) => {
  const contribQb = Contributor.getRepository().createQueryBuilder('contrib');
  const contribs = await contribQb
    .leftJoinAndSelect('contrib.file', 'file')
    .leftJoinAndSelect('contrib.user', 'user')
    .where('file.id = :fileId', { fileId: parent.id })
    .getMany();

  for (const contrib of contribs) {
    const newContrib = new Contributor();
    newContrib.file = newFile;
    newContrib.user = contrib.user;
    newContrib.email = contrib.email;
    newContrib.permissionLevel = contrib.permissionLevel;
    newContrib.inviteCode = uuidv4();
    newContrib.isAnon = false;
    newContrib.save();
  }
};

const setChildPermissions = async (file, invitedUser, emails, permissionLevel) => {
  if (file.children) {
    for (const child of file.children) {
      const childContrib = new Contributor();
      childContrib.file = child;
      childContrib.user = invitedUser;
      childContrib.isAnon = false;
      if (permissionLevel) {
        childContrib.permissionLevel = permissionLevel;
      } else {
        childContrib.permissionLevel = file.defaultPermissionLevel;
      }
      childContrib.email = invitedUser.email;
      childContrib.save();

      // for getting children of children (nested) this retard shits lazy load is almost fake...
      const qb = BalsaFile.getRepository().createQueryBuilder('file');
      file = await qb
        .leftJoinAndSelect('file.contributors', 'contributors')
        .leftJoinAndSelect('file.children', 'children')
        .leftJoinAndSelect('contributors.user', 'user')
        .where('file.id = :id', { id: child.id })
        .andWhere('(user.email NOT IN (:...emails) OR contributors IS NULL)', { emails: emails })
        // .andWhere('file.user = :ownerId', { ownerId: user.id })
        .getOne();
      if (file.children) {
        setChildPermissions(child, invitedUser, emails, permissionLevel);
      }
    }
  }
};

const resolvers = {
  Mutation: {
    searchFile: async (_, { query }, context) => {
      const user = context.user;
      const response = [];

      let qb = BalsaFile.getRepository().createQueryBuilder('file');

      const files = await qb
        .leftJoinAndSelect('file.user', 'user')
        .leftJoinAndSelect('file.contributors', 'contributors')
        .leftJoinAndSelect('contributors.user', 'contributor')
        .leftJoinAndSelect('file.stars', 'stars')
        .leftJoinAndSelect('stars.user', 'starUser')
        .where('user.id = :userID', { userID: user.id })
        .andWhere('file.isFolder = False')
        .orWhere('contributor.id = :userID', { userID: user.id })
        .orderBy('file.updatedAt', 'DESC', 'NULLS FIRST')
        .getMany();

      const options = {
        shouldSort: true,
        includeMatches: true,
        minMatchCharLength: 3,
        keys: ['cleanedContent', 'name'],
      };
      const fuse = new Fuse(files, options);

      const rawResponse = fuse.search(query);
      for (const item of rawResponse) {
        const newItem = highlighter(item);
        delete Object.assign(newItem, { ['file']: newItem['item'] })['item'];
        response.push(newItem);
      }

      return response;
    },
    giveFilePermission: async (_, { fileID, emails, permissionLevel }, context) => {
      const user = context.user;
      if (!emails) {
        return true;
      }
      if (emails.includes(user.email)) {
        throw new Error('Already owner of the file.');
      }

      const qb = BalsaFile.getRepository().createQueryBuilder('file');
      const file = await qb
        .leftJoinAndSelect('file.contributors', 'contributors')
        .leftJoinAndSelect('file.children', 'children')
        .leftJoinAndSelect('contributors.user', 'user')
        .where('file.id = :id', { id: fileID })
        .andWhere('(user.email NOT IN (:...emails) OR contributors IS NULL)', { emails: emails })
        .andWhere('file.user = :ownerId', { ownerId: user.id })
        .getOne();

      if (!file) {
        throw new Error('No such file');
      }

      const contributors = [];
      for (const email of emails) {
        const invitedUser = await User.findOne({ email });

        const contributor = new Contributor();
        contributor.file = file;
        contributor.email = email;

        // if (invitedUser) {
        contributor.isAnon = false;
        contributor.user = invitedUser;
        contributor.permissionLevel = file.defaultPermissionLevel;
        /*} else {
          contributor.isAnon = true;
          contributor.permissionLevel = file.defaultPublicPermissionLevel;
        } */

        if (permissionLevel) {
          contributor.permissionLevel = permissionLevel;
        }
        contributor.inviteCode = uuidv4();
        await contributor.save();
        contributors.push(contributor);

        if (file.children) {
          setChildPermissions(file, invitedUser, emails, permissionLevel);
        }

        logger.log(user, contributor, BehaviourLog.ACTION_GIVE_PERMISSION);
      }

      await qb
        .relation(BalsaFile, 'contributors')
        .of(file)
        .add(contributors);

      const notifier = new EmailNotifier();

      for (const contributor of contributors) {
        notifier.notify(
          user,
          contributor.user,
          EmailNotifications.SHARED_WITH_ME,
          contributor.email,
          `${user.firstName} has sent you an invitation`,
          'inviteToFile',
          {
            sender: user,
            file: file,
            url: file.getAbsoluteUrl(),
            receiver: contributor.user,
          },
          file,
        );
      }

      return true;
    },
    dropFilePermission: async (_, { fileID, email }, context) => {
      /*
        TODO: Dosya sahibi kontrolü ekle
       */
      const user = context.user;
      const contributor = await Contributor.findOne({ file: fileID, email });
      if (!contributor) {
        throw new Error('No such entry;');
      }
      logger.log(user, contributor, BehaviourLog.ACTION_DROP_PERMISSION);
      await contributor.remove();
      return true;
    },
    updateFilePermission: async (_, { fileID, email, permissionLevel }, context) => {
      /*
        TODO: Dosya sahibi kontrolü ekle
       */
      const user = context.user;
      const contributor = await Contributor.findOne({ file: fileID, email });
      contributor.permissionLevel = permissionLevel;
      await contributor.save();
      logger.log(user, contributor, BehaviourLog.ACTION_UPDATE_PERMISSION);
      return true;
    },
    createFile: async (_, { content, folderId }, context) => {
      /*
      folderId aslında parent folderın idsi
       */
      const user = context.user;
      let parent;
      if (!user) {
        throw new Error('Login Required');
      }

      const newFile = new BalsaFile();

      if (folderId) {
        parent = await BalsaFile.findOne({ id: folderId });
        newFile.parent = parent;
      }
      newFile.name = 'Untitled';
      newFile.user = user;
      newFile.updatedAt = new Date();
      newFile.content = content;
      const savedFile = await newFile.save();

      if (folderId) {
        inheritPermissions(folderId, newFile);
      }

      logger.log(user, newFile, BehaviourLog.ACTION_CREATE_FILE);

      return savedFile;
    },
    createComment: async (_, { conversationUuid, fileId, text }, context) => {
      const user = context.user;
      if (!user) {
        throw new Error('Login Required');
      }

      const newComment = new Comment();

      try {
        const file = await BalsaFile.findOneOrFail({ id: fileId });
        newComment.file = file;
      } catch (e) {
        console.log(e);
        throw new Error('File not found');
      }

      try {
        const conversation = await Conversation.findOneOrFail({ uuid: conversationUuid });
        newComment.conversation = conversation;
      } catch (e) {
        console.log(e);
        throw new Error('Conversation not found');
      }

      newComment.user = user;
      newComment.text = text;

      const savedComment = await newComment.save();
      // logger.log(user, newFile, BehaviourLog.ACTION_CREATE_FILE);

      return savedComment;
    },
    createConversation: async (_, { fileId, uuid }, context) => {
      const user = context.user;
      if (!user) {
        throw new Error('Login Required');
      }

      const conversation = new Conversation();
      conversation.file = fileId;
      conversation.uuid = uuid;
      await conversation.save();
      // logger.log(user, newFile, BehaviourLog.ACTION_CREATE_FILE);

      return conversation;
    },
    deleteConversation: async (_, { fileId, uuid }, context) => {
      const user = context.user;
      if (!user) {
        throw new Error('Login Required');
      }

      let qb = Conversation.getRepository().createQueryBuilder('conversation');

      const conversation = await qb
        .leftJoinAndSelect('conversation.file', 'file')
        .where('conversation.uuid = :uuid', { uuid })
        .andWhere('file.id = :fileId', { fileId })
        .getOne();
      const removedConversation = cloneDeep(conversation);
      conversation.remove();
      // logger.log(user, newFile, BehaviourLog.ACTION_CREATE_FILE);

      return removedConversation ;
    },
    updateFile: async (_, { id, parentId, ...fields }, context) => {
      const user = context.user;
      const log = fields.log;
      const qb = BalsaFile.getRepository().createQueryBuilder('file');
      const file = await qb
        .leftJoinAndSelect('file.contributors', 'contributors')
        .leftJoinAndSelect('file.user', 'user')
        .leftJoinAndSelect('contributors.user', 'contributor')
        .where('file.id = :id', { id })
        .getOne();

      if (!file) {
        throw new Error('No file');
      }

      if (parentId && parentId !== 0) {
        file.parent = await BalsaFile.findOne({ id: parentId });
      } else if (parentId === 0) {
        file.parent = null;
      }

      Object.assign(file, fields);
      if (fields.contentHtml) {
        file.cleanedContent = stripHtml(fields.contentHtml);
      }
      if (user.id !== file.user.id && log) {
        for (const contrib of file.contributors) {
          if (user.id === contrib.user.id) {
            const date = new Date();
            contrib.updatedFileAt = date;
            await contrib.save();
          }
        }
      } else {
        file.updatedAt = new Date();
      }

      await file.save();

      if (log) {
        const notifier = new EmailNotifier();

        const usersToNotify = file.contributors.map(contrib => {
          if (contrib.user.id !== user.id) {
            return contrib.user;
          }
        });

        if (user.id !== file.user.id) {
          usersToNotify.push(file.user);
        }

        for (const userToNotify of usersToNotify) {
          notifier.notify(
            user,
            userToNotify,
            EmailNotifications.MODIFIED_MY_DOCUMENT,
            userToNotify.email,
            `${user.firstName} has modified your document.`,
            'modifiedDocument',
            {
              sender: user,
              file: file,
              url: file.getAbsoluteUrl(),
            },
          );
        }
      }

      logger.log(user, file, BehaviourLog.ACTION_UPDATE_FILE, false, true);

      return file;
    },
    deleteFile: async (_, { id }, context) => {
      const fileToDelete = await BalsaFile.findOne(
        { id },
        { relations: ['user', 'parent', 'contributors', 'contributors.user'] },
      );

      if (!fileToDelete) {
        throw new Error('No file');
      }
      const user = context.user;
      if (
        user.id !== fileToDelete.user.id &&
        !fileToDelete.contributors.map(contrib => contrib.user.id).includes(user.id)
      ) {
        throw new Error('No permission');
      }
      const removedFile = cloneDeep(fileToDelete);

      await fileToDelete.remove();

      logger.log(user, fileToDelete, BehaviourLog.ACTION_DELETE_FILE, true);
      return removedFile;
    },
    duplicateFile: async (_, { id, name, folderId, keepContributors }, context) => {
      /*
      folderId aslında parent folderın idsi
       */
      const user = context.user;

      const fileToDuplicate = await BalsaFile.findOne({ id, user }, { relations: ['contributors'] });

      if (!fileToDuplicate) {
        throw new Error('No such file');
      }

      const newFile = new BalsaFile();

      if (name) {
        newFile.name = name;
      } else {
        newFile.name = fileToDuplicate.name;
      }
      if (folderId) {
        newFile.parent = await BalsaFile.findOne({ id: folderId });
      }

      newFile.user = user;
      newFile.content = fileToDuplicate.content;
      newFile.contentHtml = fileToDuplicate.contentHtml;
      newFile.cleanedContent = fileToDuplicate.cleanedContent;
      newFile.isFolder = fileToDuplicate.isFolder;
      newFile.defaultPublicPermissionLevel = fileToDuplicate.defaultPublicPermissionLevel;
      newFile.defaultPermissionLevel = fileToDuplicate.defaultPermissionLevel;

      if (keepContributors) {
        newFile.contributors = fileToDuplicate.contributors;
      }

      const savedFile = await newFile.save();
      logger.log(user, savedFile, BehaviourLog.ACTION_DUPLICATE_FILE);
      return savedFile;
    },
    starFile: async (_, { fileId }, context) => {
      const user = context.user;
      const file = await BalsaFile.findOne({ id: fileId });
      if (!file) {
        throw new Error('No such file');
      }
      let star = await Star.findOne(
        { file: file, user: user },
        { relations: ['user', 'file', 'file.user', 'file.contributors', 'file.contributors.user'] },
      );
      if (star) {
        await star.remove();
        logger.log(user, star, BehaviourLog.ACTION_UNSTAR_FILE, true);
      } else {
        star = new Star();
        star.file = file;
        star.user = user;
        star = await star.save();
        file.stars = [star];
        await file.save();
        // ugly hack for bug that happens when trying to reach the file from the star is failed
        star = await Star.findOne(
          { file: file, user: user },
          { relations: ['user', 'file', 'file.user', 'file.contributors', 'file.contributors.user'] },
        );
        logger.log(user, star, BehaviourLog.ACTION_STAR_FILE);
      }
      return file;
    },
    mentionUser: async (_, { fileId, userId }, context) => {
      const file = await BalsaFile.findOne(
        { id: fileId },
        { relations: ['contributors', 'contributors.user', 'user'] },
      );
      const mentionedUser = await User.findOne({ id: userId });
      const mentionerUser = context.user;

      logger.log(mentionerUser, [mentionedUser, file], BehaviourLog.ACTION_MENTIONED_ME, false, true).then(result => {
        if (result) {
          const notifier = new EmailNotifier();
          notifier.notify(
            mentionerUser,
            mentionedUser,
            EmailNotifications.MENTIONED_ME,
            mentionedUser.email,
            `${mentionerUser.firstName} has mentioned you in a document`,
            'mentionedUser',
            {
              sender: mentionerUser,
              file: file,
              url: file.getAbsoluteUrl(),
              receiver: mentionedUser,
            },
            file,
          );
        }
      });
    },
  },
  Query: {
    allFiles: async () => {
      const files = await BalsaFile.find({
        take: 1000,
        relations: ['user', 'stars'],
      });

      return files;
    },
    recentFiles: async (_, __, context) => {
      const user = context.user;

      let qb = BalsaFile.getRepository().createQueryBuilder('file');

      return (
        qb
          .leftJoinAndSelect('file.user', 'user')
          .leftJoinAndSelect('file.contributors', 'contributors')
          .leftJoinAndSelect('contributors.user', 'contributor')
          .leftJoinAndSelect('file.stars', 'stars')
          .leftJoinAndSelect('stars.user', 'starUser')
          .where('user.id = :userID', { userID: user.id })
          .andWhere('file.isFolder = False')
          .orWhere(' contributor.id = :userID', { userID: user.id })
          // .orderBy('file.updatedAt', 'DESC', 'NULLS FIRST')
          .orderBy(
            `(CASE WHEN user.id = ${user.id} THEN file.updatedAt ELSE contributors.updatedFileAt END)`,
            'ASC',
            'NULLS LAST',
          )
          .addOrderBy(
            `(CASE WHEN user.id = ${user.id} THEN file.readAt ELSE contributors.readFileAt END)`,
            'ASC',
            'NULLS LAST',
          )
          .limit(4)
          .getMany()
      );
    },
    myFiles: async (_, __, context) => {
      const user = context.user;

      let qb = BalsaFile.getRepository().createQueryBuilder('file');

      return qb
        .leftJoinAndSelect('file.user', 'user')
        .leftJoinAndSelect('file.contributors', 'contributors')
        .leftJoinAndSelect('contributors.user', 'contributor')
        .leftJoinAndSelect('file.stars', 'stars')
        .leftJoinAndSelect('stars.user', 'starUser')
        .where('(user.id = :userID OR contributor.id = :userID)', { userID: user.id })
        .andWhere('file.isFolder = False')
        .orderBy('file.updatedAt', 'DESC', 'NULLS FIRST')
        .limit(4)
        .getMany();
    },
    starredFiles: async (_, __, context) => {
      const user = context.user;

      let qb = BalsaFile.getRepository().createQueryBuilder('file');

      return qb
        .leftJoinAndSelect('file.user', 'user')
        .leftJoinAndSelect('file.contributors', 'contributors')
        .leftJoinAndSelect('contributors.user', 'contributor')
        .leftJoinAndSelect('file.stars', 'stars')
        .leftJoinAndSelect('stars.user', 'starUser')
        .where('(user.id = :userID OR contributor.id = :userID)', { userID: user.id })
        .andWhere('starUser.id = :userID', { userID: user.id })
        .orderBy('file.updatedAt', 'DESC', 'NULLS FIRST')
        .limit(4)
        .getMany();
    },
    File: async (_, { id, inviteCode, publicViewCode, log }, context) => {
      const user = context.user;
      const qb = BalsaFile.getRepository().createQueryBuilder('file');
      let file;

      if (user) {
        file = await qb
          .leftJoinAndSelect('file.contributors', 'contributors')
          .leftJoinAndSelect('file.user', 'user')
          .leftJoinAndSelect('contributors.user', 'contributor')
          .leftJoinAndSelect('file.stars', 'stars')
          .leftJoinAndSelect('stars.user', 'starUser')
          .leftJoinAndSelect('file.comments', 'fileComments')
          .where('file.id = :id', { id })
          .andWhere('(user.id = :userID OR contributor.id = :userID)', { userID: user.id })
          .getOne();

        if (user.id !== file.user.id && log) {
          for (const contrib of file.contributors) {
            if (user.id === contrib.user.id) {
              const date = new Date();
              contrib.readFileAt = date;
              await contrib.save();
            }
          }
        } else if (user.id === file.user.id && log) {
          file.readAt = new Date();
          await file.save();
        }
      } else if (publicViewCode) {
        file = await qb
          .where('file.id = :id', { id })
          .andWhere('file.publicViewCode = :publicViewCode', { publicViewCode })
          .getOne();
      } else {
        throw new Error('No permission');
      }

      if (!file) {
        throw new Error('No such file');
      }

      if (log) {
        logger.log(user, file, BehaviourLog.ACTION_READ_FILE, false, true);
      }
      return file;
    },
    contributor: async (_, { inviteCode }, context) => {
      const user = context.user;
      let contributor;
      if (user) {
        contributor = await Contributor.findOne({ user });
      }

      if (!contributor) {
        contributor = await Contributor.findOne({ inviteCode });
      }

      if (!contributor) {
        throw new Error('Wrong Code');
      }
      return contributor;
    },
    getFilePublicUrl: async (_, { id }, context) => {
      const user = context.user;
      const qb = BalsaFile.getRepository().createQueryBuilder('file');

      const file = await qb
        .leftJoin('file.user', 'user')
        .where('file.id = :id', { id })
        .andWhere('user.id = :userid', { userid: user.id })
        .getOne();
      return file.publicUrl();
    },
    conversation: async (_, { id, uuid }, context) => {
      const user = context.user;
      let qb = Conversation.getRepository().createQueryBuilder('conversation');

      qb = qb
        .leftJoinAndSelect('conversation.comments', 'comments')
        .leftJoinAndSelect('comments.user', 'user')
        .leftJoinAndSelect('conversation.file', 'file');

      if (id) {
        qb = qb.where('conversation.id = :id', { id })
      } else {
        qb =  qb.where('conversation.uuid = :uuid', { uuid })
      }

      const conversation = await qb.getOne();

      return conversation;
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
