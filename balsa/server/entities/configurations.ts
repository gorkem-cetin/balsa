import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BehaviourLog } from './behaviourLog';

@Entity()
export class Configurations extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ default: false })
  public copyLink: boolean;

  @Column({ default: false })
  public appInitialized: boolean;

  @OneToMany(type => BehaviourLog, object => object.configuration)
  public logs: BehaviourLog[];
}
