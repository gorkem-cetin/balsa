import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';
import {User} from "./user";
import {BalsaFile} from "./balsaFile";
import {Configurations} from "./configurations";
import {Contributor} from "./contributor";
import {Star} from "./star";
import {UserInviteCode} from "./userInviteCode";
import {UserConfigurations} from "./userConfigurations";


const ACTION_CREATE_FILE = 'Created File';
const ACTION_UPDATE_FILE = 'Updated File';
const ACTION_READ_FILE = 'Read File';
const ACTION_DELETE_FILE = 'Deleted File';
const ACTION_DUPLICATE_FILE = 'Duplicated File';

const ACTION_CREATE_FOLDER = 'Created Folder';
const ACTION_UPDATE_FOLDER = 'Updated Folder';
const ACTION_DELETE_FOLDER = 'Deleted Folder';

const ACTION_GIVE_PERMISSION = 'Gave Permission';
const ACTION_DROP_PERMISSION = 'Dropped Permission';
const ACTION_UPDATE_PERMISSION = 'Updated Permission';

const ACTION_STAR_FILE = 'Starred File';
const ACTION_UNSTAR_FILE = 'Unstarred File';

const ACTION_INVITE_USER = 'Invited User';
const ACTION_ACCEPT_USER_INVITE = 'Accepted User Invitation';
const ACTION_REVOKE_USER_INVITE = 'Revoked User Invitation';
const ACTION_DELETE_USER = 'Removed User';
const ACTION_UPDATE_USER = 'Update User';
const ACTION_REGISTER_USER = 'User Registered';
const ACTION_LOGIN_USER = 'User Logged In';
const ACTION_PASSWORD_CHANGE_USER = 'User Changed Password';
const ACTION_PASSWORD_RESET_START_USER = 'User Started Reset Password';
const ACTION_PASSWORD_RESET_USER = 'User Reset Password';

const ACTION_RECEIVE_SHARED_WITH_ME = 'User Received a Document Shared E-mail';
const ACTION_REPLIED_ME = 'User Received a Comment Replied E-mail';
const ACTION_MENTIONED_ME = 'User Received a You are Mentioned E-mail';
const ACTION_MODIFIED_MY_DOCUMENT = 'User Received a Your Document Edited E-mail';
const ACTION_PUBLISHED_DOCUMENT = 'User Received a Document Published E-mail';


@Entity()
export class BehaviourLog extends BaseEntity {
  public static ACTION_CREATE_FILE = ACTION_CREATE_FILE;
  public static ACTION_UPDATE_FILE = ACTION_UPDATE_FILE;
  public static ACTION_READ_FILE = ACTION_READ_FILE;
  public static ACTION_DELETE_FILE = ACTION_DELETE_FILE;
  public static ACTION_DUPLICATE_FILE = ACTION_DUPLICATE_FILE;

  public static ACTION_CREATE_FOLDER = ACTION_CREATE_FOLDER;
  public static ACTION_UPDATE_FOLDER = ACTION_UPDATE_FOLDER;
  public static ACTION_DELETE_FOLDER = ACTION_DELETE_FOLDER;

  public static ACTION_GIVE_PERMISSION = ACTION_GIVE_PERMISSION;
  public static ACTION_DROP_PERMISSION = ACTION_DROP_PERMISSION;
  public static ACTION_UPDATE_PERMISSION = ACTION_UPDATE_PERMISSION;

  public static ACTION_STAR_FILE = ACTION_STAR_FILE;
  public static ACTION_UNSTAR_FILE = ACTION_UNSTAR_FILE;

  public static ACTION_INVITE_USER = ACTION_INVITE_USER;
  public static ACTION_ACCEPT_USER_INVITE = ACTION_ACCEPT_USER_INVITE;
  public static ACTION_REVOKE_USER_INVITE = ACTION_REVOKE_USER_INVITE;
  public static ACTION_DELETE_USER = ACTION_DELETE_USER;
  public static ACTION_UPDATE_USER = ACTION_UPDATE_USER;
  public static ACTION_REGISTER_USER = ACTION_REGISTER_USER;
  public static ACTION_LOGIN_USER = ACTION_LOGIN_USER;
  public static ACTION_PASSWORD_CHANGE_USER = ACTION_PASSWORD_CHANGE_USER;
  public static ACTION_PASSWORD_RESET_START_USER = ACTION_PASSWORD_RESET_START_USER;
  public static ACTION_PASSWORD_RESET_USER = ACTION_PASSWORD_RESET_USER;

  public static ACTION_RECEIVE_SHARED_WITH_ME = ACTION_RECEIVE_SHARED_WITH_ME;
  public static ACTION_REPLIED_ME = ACTION_REPLIED_ME;
  public static ACTION_MENTIONED_ME = ACTION_MENTIONED_ME;
  public static ACTION_MODIFIED_MY_DOCUMENT = ACTION_MODIFIED_MY_DOCUMENT;
  public static ACTION_PUBLISHED_DOCUMENT = ACTION_PUBLISHED_DOCUMENT;

  public static ACTIVITY_LOG_ACTIONS = [ACTION_STAR_FILE, ACTION_CREATE_FILE, ACTION_UPDATE_FILE, ACTION_ACCEPT_USER_INVITE, ACTION_GIVE_PERMISSION, ACTION_MENTIONED_ME, ACTION_CREATE_FOLDER];


  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public action: string;

  @Column()
  public objectType: string;

  @Column()
  public data: string;

  @CreateDateColumn()
  public createdAt: Date;

  @ManyToOne(type => User, user => user.actedLogs, { nullable: true, onDelete: "SET NULL" })
  public actor: User;

  @JoinTable()
  @ManyToMany(type => User, user => user.affectedLogs)
  public affectedUsers: User[];

  @ManyToOne(type => User, user => user.logs, { nullable: true, onDelete: "SET NULL" })
  public user: User;

  @ManyToOne(type => BalsaFile, file => file.logs, { nullable: true, onDelete: "SET NULL" })
  public file: BalsaFile;

  @ManyToOne(type => Configurations, config => config.logs, { nullable: true, onDelete: "SET NULL" })
  public configuration: Configurations;

  @ManyToOne(type => UserConfigurations, config => config.logs, { nullable: true, onDelete: "SET NULL" })
  public userConfiguration: UserConfigurations;

  @ManyToOne(type => Contributor, contrib => contrib.logs, { nullable: true, onDelete: "SET NULL" })
  public contributor: Contributor;

  @ManyToOne(type => Star, star => star.logs, { nullable: true, onDelete: "SET NULL" })
  public star: Star;

  @ManyToOne(type => UserInviteCode, code => code.logs, { nullable: true, onDelete: "SET NULL"  })
  public userInviteCode: UserInviteCode;
}
