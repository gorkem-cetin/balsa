import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn, OneToMany
} from 'typeorm';
import { User } from './user';
import { UUIDTransformer } from './transformers';
import { CLIENT_URL } from '../constants';
import { BalsaFile } from './balsaFile';
import {BehaviourLog} from "./behaviourLog";

@Entity()
export class Contributor extends BaseEntity {
  /*
  Maybe we can add expire date ?
 */
  public READ_ONLY: string = 'READ_ONLY';
  public READ_WRITE: string = 'READ_WRITE';

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public isAnon: boolean;

  @Column({ nullable: true })
  public email: string;

  @Column({ transformer: new UUIDTransformer() })
  public inviteCode: string;

  @Column({ default: 'READ_ONLY' })
  public permissionLevel: string;

  @Column({ nullable: true })
  public readFileAt: Date;

  @Column({ nullable: true })
  public updatedFileAt: Date;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @ManyToOne(type => BalsaFile, file => file.contributors, { nullable: false, onDelete: 'CASCADE' })
  public file: BalsaFile;

  @ManyToOne(type => User, object => object.contributions, { nullable: true, onDelete: 'CASCADE' })
  public user: User;

  @OneToMany(type => BehaviourLog, object => object.contributor)
  public logs: BehaviourLog[];

  public inviteUrl() {
    return `${CLIENT_URL}${this.file.getUrl()}${this.inviteCode}`;
  }
}
