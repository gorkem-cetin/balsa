import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import {BehaviourLog} from "../entities/behaviourLog";

const ACCESS_LOG_PATH = path.join(__dirname, '../../var/log/server/access.log');
const LOG_INTERVAL = 60 * 30;
// log to console
const dev = morgan('dev', {
  skip(req, res) {
    return res.statusCode < 400;
  },
});

// log all requests to access.log
const common = morgan('common', {
  stream: fs.createWriteStream(ACCESS_LOG_PATH, { flags: 'a' }),
});

const logExistCheck = async (user, entity, action, interval) => {

  const now = new Date();
  const lookupDate = new Date(now.getTime() - interval * 1000);

  const qb = BehaviourLog.getRepository().createQueryBuilder('log');
  // const log = await BehaviourLog.findOne({ user, objectType, action, file: entity });

  let log = await qb.leftJoin('log.actor', 'actor')
    .leftJoin('log.file', 'file')
    .leftJoin('log.user', 'user')
    .where('log.action = :action', { action })
    .andWhere("log.createdAt > :lookupDate", { lookupDate: lookupDate.toISOString() })
    .andWhere('actor.id = :actorId', { actorId: user.id });

  if (Array.isArray(entity)) {
    const _user = entity[0];
    const file = entity[1]
    const objectType = file.constructor.name;
    log = log
      .andWhere('log.objectType = :objectType', { objectType })
      .andWhere('file.id = :fileId', { fileId: file.id})
      .andWhere('user.id = :userId', { userId: _user.id})
  } else {
    const objectType = entity.constructor.name;
    log = log
      .andWhere('log.objectType = :objectType', { objectType })
      .andWhere('file.id = :fileId', { fileId: entity.id})
  }
    log = await log.limit(1).getMany();

  return !!log.length;
};


class BehaviourLogger {
  parseUsersFromFile(log, file) {
    let fileUsers = [];
    if (file.contributors) {
      fileUsers = fileUsers.concat(file.contributors.filter((contrib) => {
        return contrib.user.id !== log.actor.id
      }).map((contrib) => contrib.user));
    }
    if (log.actor.id !== file.user.id) {
      fileUsers.push(file.user);
    }
    return fileUsers;
  }
  setAffectedUsers(log, entity) {
    if (!log.affectedUsers) {
      log.affectedUsers = [];
    }
    if (log.objectType === 'BalsaFile') {
      log.affectedUsers = this.parseUsersFromFile(log, entity);
    } else if (log.objectType === 'User') {
      log.affectedUsers.push(entity);
    } else if (log.objectType === 'Contributor') {
      log.affectedUsers.push(entity.user);
    } else if (log.objectType === 'Star') {
      log.affectedUsers = this.parseUsersFromFile(log, entity.file)
    } else if (log.objectType === 'UserInviteCode') {
      log.affectedUsers.push()
    }

    return log;
  }
  setEntity(log, entity, deletion) {
    log.objectType = entity.constructor.name;

    if (!deletion) {
      if (log.objectType === 'BalsaFile') {
        log.file = entity;
      } else if (log.objectType === 'User') {
        log.user = entity;
      } else if (log.objectType === 'Configuration') {
        log.configuration = entity;
      } else if (log.objectType === 'Contributor') {
        log.contributor = entity;
      } else if (log.objectType === 'Star') {
        log.star = entity;
      } else if (log.objectType === 'UserInviteCode') {
        log.userInviteCode = entity;
      }
    }

    log = this.setAffectedUsers(log, entity);
    log.data = JSON.stringify(entity);
    return log;
  }
  async log(user, entity, action, deletion, intervalCheck) {
    if (intervalCheck) {
      const existCheck = await logExistCheck(user, entity, action, LOG_INTERVAL);
      if (existCheck) {
        return false;
      }
    }
    if (entity.id || (deletion && !entity.id) || Array.isArray(entity)) {
      let log = new BehaviourLog();
      log.actor = user;
      log.action = action;
      if (Array.isArray(entity)) {
        for (const item of entity) {
          log = this.setEntity(log, item, deletion);
        }
      } else {
        log = this.setEntity(log, entity, deletion);
      }
      log.save();
      return true;
    }
    return false;
  }
}

module.exports = {
  devLog: dev,
  commonLog: common,
  BehaviourLogger,
  logExistCheck
};
