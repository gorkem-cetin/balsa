import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
  ManyToMany, JoinTable, OneToOne, JoinColumn
} from 'typeorm';
import { BalsaFile } from './balsaFile';
import { FileTransformer } from './transformers';
import { ForgotPasswordCode } from './forgotPasswordCode';
import { Contributor } from './contributor';
import { Star } from './star';
import {BehaviourLog} from "./behaviourLog";
import { Comment } from './comment';
import {UserConfigurations} from "./userConfigurations";
import {EmailNotifications} from "./emailNotifications";
import {CronJob} from "./cronJob";

const ROLE_USER = 'User';
const ROLE_ADMIN = 'Admin';
const ROLE_SUPERUSER = 'Superuser';

const STATUS_ACTIVE = 'Active';
const STATUS_PASSIVE  = 'Passive';

@Entity()
export class User extends BaseEntity {
  public static ROLE_USER = ROLE_USER;
  public static ROLE_ADMIN = ROLE_ADMIN;
  public static ROLE_SUPERUSER = ROLE_SUPERUSER;

  public static STATUS_ACTIVE = STATUS_ACTIVE;
  public static STATUS_PASSIVE = STATUS_PASSIVE;

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column('varchar', { unique: true })
  public email: string;

  @Column()
  public password: string;

  @Column({ nullable: true })
  public jobTitle: string;

  @Column({ nullable: true, length: 500, transformer: new FileTransformer() })
  public profilePhoto: string;

  @CreateDateColumn()
  public createdAt: Date;

  @Column({ default: ROLE_USER})
  public role:  string;

  @Column({ default: STATUS_ACTIVE})
  public status:  string;

  @OneToMany(type => Star, star => star.user, { nullable: false })
  public stars: Star;

  @OneToMany(type => Comment, comment => comment.user, { nullable: false })
  public comments: Comment;

  @OneToMany(type => BalsaFile, balsaFile => balsaFile.user)
  public files: BalsaFile[];

  @OneToMany(type => Contributor, object => object.user)
  public contributions: Contributor[];

  @OneToMany(type => BehaviourLog, object => object.actor)
  public actedLogs: BehaviourLog[];

  @ManyToMany(type => BehaviourLog, object => object.affectedUsers)
  public affectedLogs: BehaviourLog[];

  @OneToMany(type => BehaviourLog, object => object.user)
  public logs: BehaviourLog[];

  @OneToMany(type => ForgotPasswordCode, code => code.user)
  public forgotPasswordCodes: ForgotPasswordCode[];

  @OneToMany(type => UserConfigurations, config => config.user)
  public userConfiguration: UserConfigurations[];

  @OneToMany(type=> EmailNotifications, object => object.sender)
  public sentNotifications: EmailNotifications[];

  @OneToMany(type=> EmailNotifications, object => object.receiver)
  public receivedNotifications: EmailNotifications[];

  @OneToMany(type=> CronJob, object => object.owner)
  public cronJobs: CronJob[];

  public fileCount() {
    return this.files.length;
  }

  public fileContributorsCount() {
    const _contribs: number[] = [];
    for (const file of this.files) {
      for (const contrib of file.contributors) {
        if (!_contribs.includes(contrib.id)) {
          _contribs.push(contrib.id);
        }
      }
    }

    return _contribs.length;
  }
}
