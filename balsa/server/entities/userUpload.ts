import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    CreateDateColumn,
  } from 'typeorm';
  import { FileTransformer } from './transformers';
  
  
  @Entity()
  export class UserUpload extends BaseEntity {  
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: true, length: 500, transformer: new FileTransformer() })
    public file: string;
  
    @CreateDateColumn()
    public createdAt: Date;
  }
  