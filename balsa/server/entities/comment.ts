import {
    Entity,
    PrimaryGeneratedColumn,
    BaseEntity,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    Column
  } from 'typeorm';
  import { User } from './user';
  import { BalsaFile } from './balsaFile';
import {Conversation} from "./conversation";

  @Entity()
  export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(type => User, user => user.comments, { nullable: false })
    public user: User;

    @ManyToOne(type => BalsaFile, file => file.comments, { nullable: false, onDelete: 'CASCADE' })
    public file: BalsaFile;

    @ManyToOne(type => Conversation, conversation => conversation.comments, { nullable: false, onDelete: 'CASCADE' })
    public conversation: Conversation;

    @Column()
    public text: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
  }
