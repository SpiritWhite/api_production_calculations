import { randomUUID } from 'node:crypto';
import {
  Entity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  AfterUpdate,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { User } from './';

@Entity('email_recovery', {})
export class EmailRecovery {

  @Column('uuid', {
    name: 'user_id',
    primary: true,
    default: randomUUID(),

  })
  userId?: string;

  @Column('varchar', {
    name: 'token_recovery',
    nullable: false,
    unique: true
  })
  tokenRecovery: string;

  @Column('timestamp without time zone', {
    name: 'expire_in',
    nullable: false,
    unique: true
  })
  expireIn: Date;

  @Column('bool', {
    name: 'is_active',
    nullable: false,
    default: true
  })
  isActive: boolean;

  @Column('varchar', {
    name: 'created_by',
    nullable: false
  })
  createdBy: string;

  @Column('timestamp without time zone', {
    name: 'created_at',
    nullable: false
  })
  createdAt: Date;

  @Column('varchar', {
    name: 'updated_by',
    nullable: false
  })
  updatedBy: string;

  @Column('timestamp without time zone', {
    name: 'updated_at',
    nullable: false
  })
  updatedAt: Date;

  @OneToOne(type => User, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;


  @BeforeInsert()
  @BeforeUpdate()
  checkFieldBeforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @AfterUpdate()
  updatedTable() {
    this.updatedAt = new Date();
  }
  
}