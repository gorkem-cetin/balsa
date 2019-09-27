import {Entity, Column, BaseEntity, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinTable, ManyToOne} from 'typeorm';
import {BehaviourLog} from "./behaviourLog";
import {User} from "./user";
import {SHARED_WITH_ME, REPLIED_ME, MENTIONED_ME, MODIFIED_MY_DOCUMENT, PUBLISHED_DOCUMENT} from '../constants';
@Entity()
export class UserConfigurations extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ default: true })
  public notifyMeOnShare: boolean;

  @Column({ default: true })
  public notifyMeOnReply: boolean;

  @Column({ default: true })
  public notifyMeOnMention: boolean;

  @Column({ default: true })
  public notifyMeOnModify: boolean;

  @OneToMany(type => BehaviourLog, object => object.userConfiguration)
  public logs: BehaviourLog[];

  @ManyToOne(type=> User, object => object.userConfiguration, { onDelete: 'CASCADE' })
  public user: User;

  public checkConfig(type: String): boolean {
    if (type === SHARED_WITH_ME) {
      return this.notifyMeOnShare;
    } else if (type === REPLIED_ME) {
      return this.notifyMeOnReply;
    } else if (type === MENTIONED_ME) {
      return this.notifyMeOnMention;
    } else if (type === MODIFIED_MY_DOCUMENT) {
      return this.notifyMeOnModify;
    }
    return false;
  }

  public getInterval(type: String): number {
    // interval as seconds
    if (type === SHARED_WITH_ME) {
      return 0;
    } else if (type === REPLIED_ME) {
      return 0;
    } else if (type === MENTIONED_ME) {
      return 0;
    } else if (type === MODIFIED_MY_DOCUMENT) {
      return 6 * 60 * 60;
    } else if (type === PUBLISHED_DOCUMENT) {
      return 0;
    }
    return 0;
  }
}
