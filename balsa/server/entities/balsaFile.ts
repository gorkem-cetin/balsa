import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user';
import { Contributor } from './contributor';
import { UUIDTransformer } from './transformers';
import { CLIENT_URL } from '../constants';
import { Star } from './star';
import { UserAwareEntity } from './abstracts';
import { BehaviourLog } from './behaviourLog';
import { Comment } from './comment';
import {Conversation} from "./conversation";

@Entity()
export class BalsaFile extends UserAwareEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: true })
  public color: string;

  @Column()
  public name: string;

  @Column({ default: '' })
  public content: string;

  @Column({ nullable: true })
  public contentHtml: string;

  @Column({ nullable: true })
  public cleanedContent: string;

  @Column({ nullable: true })
  public cursorPosition: number;

  @Column({ default: 'READ_ONLY' })
  public defaultPublicPermissionLevel: string;

  @Column({ default: 'READ_WRITE' })
  public defaultPermissionLevel: string;

  @Column({ transformer: new UUIDTransformer() })
  public publicViewCode: string;

  @CreateDateColumn()
  public createdAt: Date;

  @Column({ nullable: true })
  public updatedAt: Date;

  @Column({ nullable: true })
  public readAt: Date;

  @ManyToOne(type => User, user => user.files, { nullable: false, onDelete: 'CASCADE' })
  public user: User;

  @OneToMany(type => Star, star => star.file, { nullable: false })
  public stars: Star[];

  @OneToMany(type => Comment, comment => comment.file, { nullable: false })
  public comments: Comment[];

  @OneToMany(type => Contributor, object => object.file)
  public contributors: Contributor[];

  @ManyToOne(type => BalsaFile, file => file.children, { onDelete: 'CASCADE' })
  public parent: BalsaFile;

  @OneToMany(type => BalsaFile, file => file.parent)
  public children: BalsaFile[];

  @OneToMany(type => BehaviourLog, object => object.file)
  public logs: BehaviourLog[];

  @OneToMany(type => Conversation, conversation => conversation.file,)
  public conversations: Conversation[];

  @Column({ type: Boolean, default: false })
  public isFolder: Boolean;

  public isStarred() {
    if (this.stars && this.requestUser) {
      return this.stars.filter(star => star.user.id === this.requestUser.id).length > 0;
    } else {
      return false;
    }
  }

  public hasWritePermission() {
    return this.user.id === this.requestUser.id || this.contributors.map((contrib) => {
      if (contrib.permissionLevel === contrib.READ_WRITE) {
        return contrib.user.id
      }
    }).includes(this.requestUser.id);
  }

  public getUrl() {
    if (this.isFolder) {
      return `/${this.id}/`;
    } else {
      return `/editor/${this.id}/`;
    }
  }

  public getAbsoluteUrl() {
    return `${CLIENT_URL}${this.getUrl()}`;
  }

  public publicUrl() {
    return `${CLIENT_URL}/editor/${this.id}/view/${this.publicViewCode}/`;
  }

  public lastEditor() {
    const result = this.contributors.sort((c1, c2) => {
      if (c1.updatedFileAt > c2.updatedFileAt) {
        return 1;
      } else if (c1.updatedFileAt < c2.updatedFileAt) {
        return -1;
      } else {
        return 0;
      }
    });
    if (result) {
      return result[0];
    } else {
      return null;
    }
  }

  public nonMeContributors() {
    const users = this.contributors.filter((contrib) => {
      if (contrib.user.id !== this.requestUser.id) {
        return contrib;
      }
    }).map((contrib) => {
      return contrib.user;
    });
    if (this.user.id !== this.requestUser.id) {
      users.push(this.user);
    }
    return users;
  }
}
