import {Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, OneToMany} from 'typeorm';
import { UUIDTransformer } from './transformers';
import { CLIENT_URL } from '../constants';
import {BehaviourLog} from "./behaviourLog";

const STATUS_PENDING  = 'Pending';
const ROLE_USER = 'User';
const ROLE_ADMIN = 'Admin';

@Entity()
export class UserInviteCode extends BaseEntity {
  /*
    Maybe we can add expire date ?
   */
  public STATUS_PENDING = STATUS_PENDING;
  public ROLE_USER = ROLE_USER;
  public ROLE_ADMIN = ROLE_ADMIN;

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public email: string;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column({ default: STATUS_PENDING })
  public status: string;

  @Column({ default: ROLE_USER})
  public role:  string;

  @Column({ transformer: new UUIDTransformer() })
  public inviteCode: string;

  @CreateDateColumn()
  public createdAt: Date;

  @OneToMany(type => BehaviourLog, object => object.userInviteCode)
  public logs: BehaviourLog[];

  public inviteUrl() {
    return `${CLIENT_URL}/invite/${this.inviteCode}`;
  }
}
