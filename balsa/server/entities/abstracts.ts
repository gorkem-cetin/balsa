import { BaseEntity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BalsaFile } from './balsaFile';
import { User } from './user';

/* const defaultDate = () => {
  const days = 7;
  let date = new Date();
  date = new Date(date.setTime(date.getTime() + days * 86400000));
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
}; */

export abstract class ShareableBase extends BaseEntity {
  public READ_ONLY: string = 'READ_ONLY';
  public READ_WRITE: string = 'READ_WRITE';

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ default: 'READ_ONLY' })
  public permissionLevel: string;

  @ManyToOne(type => BalsaFile, file => file.contributors, { nullable: false })
  public file: BalsaFile;
}

export abstract class UserAwareEntity extends BaseEntity {
  public requestUser: User;

  public setRequestUser(user: User) {
    this.requestUser = user;
  }
}
