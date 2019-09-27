import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn
} from 'typeorm';
import { User } from "./user";

const STARTED = 'started';
const FINISHED = 'finished';
const ON_QUEUE = 'on_queue';
const CANCELLED = 'cancelled';
const SEND_NOTIFICATIONS = 'send_notifications';

@Entity()
export class CronJob extends BaseEntity {
  public static STARTED = STARTED;
  public static FINISHED = FINISHED;
  public static ON_QUEUE = ON_QUEUE;
  public static CANCELLED = CANCELLED;

  public static SEND_NOTIFICATIONS = SEND_NOTIFICATIONS;

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public job: String;

  @Column()
  public status: String;

  @Column()
  public data: String;

  @Column()
  public executeDate: Date;

  @CreateDateColumn()
  public createdAt: Date;

  @ManyToOne(type=> User, object => object.cronJobs, { nullable: true })
  public owner: User;

}
