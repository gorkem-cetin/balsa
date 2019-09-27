import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany, Column,
} from 'typeorm';
import { BalsaFile } from './balsaFile';
import {Comment} from "./comment";

@Entity()
export class Conversation extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public uuid: String;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @OneToMany(type => Comment, comment => comment.conversation)
  public comments: Comment[];

  @ManyToOne(type => BalsaFile, file => file.conversations, { nullable: false, onDelete: 'CASCADE' })
  public file: BalsaFile;
}
