import { Entity, Column, BaseEntity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CLIENT_URL } from '../constants';
import { UUIDTransformer } from './transformers';
import { User } from './user';

@Entity()
export class ForgotPasswordCode extends BaseEntity {
  /*
    Maybe we can add expire date ?
   */
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(type => User, user => user.forgotPasswordCodes)
  public user: User;

  @Column({ transformer: new UUIDTransformer() })
  public code: string;

  @Column({ default: false })
  public expired: boolean;

  public passwordChangeUrl() {
    return `${CLIENT_URL}/forgot-password/${this.code}`;
  }
}
