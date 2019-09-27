import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn
} from 'typeorm';
import { User } from "./user";
import {SHARED_WITH_ME, REPLIED_ME, MENTIONED_ME, MODIFIED_MY_DOCUMENT} from '../constants';

@Entity()
export class EmailNotifications extends BaseEntity {
  public static SHARED_WITH_ME = SHARED_WITH_ME;
  public static REPLIED_ME = REPLIED_ME;
  public static MENTIONED_ME = MENTIONED_ME;
  public static MODIFIED_MY_DOCUMENT = MODIFIED_MY_DOCUMENT;

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public type: String;

  @Column()
  public to: String;

  @Column()
  public subject: String;

  @Column()
  public template: String;

  @Column({ nullable: true })
  public data: String;

  @Column()
  public isSent: Boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @ManyToOne(type=> User, object => object.sentNotifications, { nullable: true })
  public sender: User;

  @ManyToOne(type=> User, object => object.receivedNotifications, { nullable: true })
  public receiver: User;

  public getMessage() {
    if (this.type === SHARED_WITH_ME) {
      return `${this.sender.firstName} ${this.sender.lastName} has invited you to a document.`
    } else if (this.type === MODIFIED_MY_DOCUMENT) {
      return `${this.sender.firstName} ${this.sender.lastName} has updated your document.`
    }
  }

}
