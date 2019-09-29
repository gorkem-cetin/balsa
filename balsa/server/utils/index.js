import Mailer from '../mail/base';
import {UserConfigurations} from "../entities/userConfigurations";
import {BehaviourLogger, logExistCheck} from "../logging/core";
import {MENTIONED_ME, MODIFIED_MY_DOCUMENT, PUBLISHED_DOCUMENT, REPLIED_ME, SHARED_WITH_ME, SMTP_DEFAULT_FROM_EMAIL} from "../constants";
import {BehaviourLog} from "../entities/behaviourLog";
import {scheduleJob} from 'node-schedule';
import {EmailNotifications} from "../entities/emailNotifications";
import {CronJob} from "../entities/cronJob";

const logger = new BehaviourLogger();


class EmailNotifier {
  async notify(sender, receiver, type, to, subject, template, data) {
    const config = await UserConfigurations.findOne({ receiver });

    const interval = config.getInterval(type);
    if (config.checkConfig(type)) {
      if (interval) {
        const exist = await this.notificationExistCheck(receiver, type, interval);
        if (exist) {
          this.createNotification(sender, receiver, type, to, subject, template, data, false).then(async (obj) => {
            const scheduleCheck = await this.checkSchedule(receiver);
            if (!scheduleCheck) {
              const executeDate = new Date(obj.createdAt.getTime() + (21600 * 1000)); // 26100 saniye = 6 saat
              this.createCronJob(obj, executeDate);
            }
          })
        } else {
          this.createNotification(sender, receiver, type, to, subject, template, data, true);
          this.sendNotification(type, to, subject, template, data);
        }
      } else {
        this.createNotification(sender, receiver, type, to, subject, template, data, true);
        this.sendNotification(type, to, subject, template, data);
      }
    }

  }
  async notificationExistCheck(user, type, interval) {
    const now = new Date();
    const lookupDate = new Date(now.getTime() - interval * 1000);

    const qb = EmailNotifications.getRepository().createQueryBuilder('notification');
    // const log = await BehaviourLog.findOne({ user, objectType, action, file: entity });
    const notification = await qb.leftJoin('notification.sender', 'sender')
      .leftJoin('notification.receiver', 'receiver')
      .andWhere('notification.isSent = True')
      .andWhere('notification.type = :type', { type })
      .andWhere('receiver.id = :userId', { userId: user.id })
      .andWhere("notification.createdAt > :lookupDate", { lookupDate: lookupDate.toISOString() })
      .orderBy('notification.createdAt', 'DESC', 'NULLS FIRST')
      .limit(1)
      .getMany();

    if (notification.length) {
      return notification[0]
    } else {
      return false;
    }
  }
  async createNotification(sender, receiver, type, to, subject, template, data, isSent) {
    const notification = new EmailNotifications();
    notification.sender = sender;
    notification.receiver = receiver;
    notification.to = to;
    notification.type = type;
    notification.subject = subject;
    notification.template = template;
    notification.data = JSON.stringify(data);
    notification.isSent = isSent;
    await notification.save();
    return notification
  }
  async sendNotification(type, to, subject, template, data) {
    const mailer = new Mailer();
    const from = 'noreply@describe.im';
    mailer.sendMail(from, to, subject, template, data);
    // logger.log(user, file, action, false, true);
  }
  async sendAllNotifications(receiver, type) {
    const qb = EmailNotifications.getRepository().createQueryBuilder('notification');
    const notifications = await qb.leftJoinAndSelect('notification.sender', 'sender')
      .leftJoinAndSelect('notification.receiver', 'receiver')
      .andWhere('notification.isSent = False')
      .andWhere('notification.type = :type', { type })
      .andWhere('receiver.id = :userId', { userId: receiver.id })
      .getMany();

    const context = {notifications: []};
    for (const notification of notifications) {
      const data = JSON.parse(notification.data);
      data.message = notification.getMessage();
      context.notifications.push(data);
      notification.isSent = true;
      notification.save();
    }

    context.receiver = receiver;
    if (context.notifications.length) {
      this.sendNotification(
        type,
        receiver.email,
        `You have new notifications (${context.notifications.length})`,
        'multipleNotifications',
        context
      );
    }

  }
  async checkSchedule(receiver) {
    const qb = CronJob.getRepository().createQueryBuilder('cronJob');
    const jobs = await qb
      .leftJoinAndSelect('cronJob.owner', 'owner')
      .where('cronJob.status = :status', { status: CronJob.ON_QUEUE })
      .andWhere('owner.id = :userid', { userid: receiver.id })
      .andWhere('cronJob.job = :job', { job: CronJob.SEND_NOTIFICATIONS })
      .limit(1)
      .getMany();

    return !!jobs.length;
  }
  async createCronJob(notification, executeDate) {
    const cronJob = new CronJob();
    const _this = this;
    cronJob.job = CronJob.SEND_NOTIFICATIONS;
    cronJob.data = JSON.stringify(notification);
    cronJob.status = CronJob.ON_QUEUE;
    cronJob.executeDate = executeDate;
    cronJob.save().then(obj => {
      scheduleJob(obj.executeDate, function(){
        _this.sendAllNotifications(notification.receiver, notification.type)
        cronJob.status = CronJob.FINISHED;
        cronJob.save();
      });
    })
  }
}

module.exports = {
  passwordStrongCheck: password => {
    let score = 0;
    if (!password) return score;

    // award every unique letter until 5 repetitions
    const letters = {};
    for (let i = 0; i < password.length; i++) {
      letters[password[i]] = (letters[password[i]] || 0) + 1;
      score += 5.0 / letters[password[i]];
    }

    // bonus points for mixing it up
    const variations = {
      digits: /\d/.test(password),
      lower: /[a-z]/.test(password),
      upper: /[A-Z]/.test(password),
      nonWords: /\W/.test(password),
    };

    let variationCount = 0;
    for (const check in variations) {
      variationCount += variations[check] === true ? 1 : 0;
    }
    score += (variationCount - 1) * 10;

    return parseInt(score);
  },
  highlighter: resultItem => {
    resultItem.matches.forEach((matchItem) => {
      const text = resultItem.item[matchItem.key];
      const result = [];
      const matches = [].concat(matchItem.indices);
      let pair = matches.shift();

      const x = matchItem.indices[0][0];
      const y = matchItem.indices[0][1];

      for (let i = 0; i < text.length; i++) {
        const char = text.charAt(i);
        if (pair && i == pair[0]) {
          result.push('<b>')
        }
        if (i >= x-10 && i <= y+10) {
          result.push(char);
        }
        if (pair && i == pair[1]) {
          result.push('</b>');
          pair = matches.shift()
        }
      }
      resultItem.highlightedField = matchItem.key;
      if (resultItem.highlightedField !== 'name') {
        resultItem.highlight = `...${result.join('')}...`;
      } else {
        resultItem.highlight = result.join('');
      }

      if(resultItem.children && resultItem.children.length > 0){
        resultItem.children.forEach((child) => {
          highlighter(child);
        });
      }
    });
    return resultItem
  },
  notifyUser: async (user, type, to, subject, template, data, file) => {
    const config = await UserConfigurations.findOne({ user });
    if (config.checkConfig(type)) {
      let action;
      if (type === SHARED_WITH_ME) {
        action = BehaviourLog.ACTION_RECEIVE_SHARED_WITH_ME;
      } else if (type === REPLIED_ME) {
        action = BehaviourLog.ACTION_REPLIED_ME;
      } else if (type === MENTIONED_ME) {
        action = BehaviourLog.ACTION_MENTIONED_ME;
      } else if (type === MODIFIED_MY_DOCUMENT) {
        action = BehaviourLog.ACTION_MODIFIED_MY_DOCUMENT;
      } else if (type === PUBLISHED_DOCUMENT) {
        action = BehaviourLog.ACTION_PUBLISHED_DOCUMENT;
      }

      const interval = config.getInterval(type);
      let existCheck = false;

      if (interval) {
        existCheck = await logExistCheck(user, file, action, interval);
      }

      if (!existCheck) {
        const mailer = new Mailer();
        const from = SMTP_DEFAULT_FROM_EMAIL;
        mailer.sendMail(from, to, subject, template, data);
        logger.log(user, file, action, false, true);
      }
    }
  },
  EmailNotifier
};

