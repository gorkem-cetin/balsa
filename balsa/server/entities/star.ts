import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { User } from './user';
import { BalsaFile } from './balsaFile';
import {BehaviourLog} from "./behaviourLog";

@Entity()
export class Star extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(type => User, user => user.stars, { nullable: false })
  public user: User;

  @ManyToOne(type => BalsaFile, file => file.stars, { nullable: false, onDelete: 'CASCADE' })
  public file: BalsaFile;

  @OneToMany(type => BehaviourLog, object => object.star)
  public logs: BehaviourLog[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
