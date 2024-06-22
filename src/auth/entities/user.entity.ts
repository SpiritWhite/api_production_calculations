import { randomUUID } from 'node:crypto';
import {
  AfterUpdate,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
} from 'typeorm';

@Entity('users', {})
export class User {

  @Column('uuid', {
    name: 'user_id',
    primary: true,
    default: randomUUID()
  })
  userId?: string;

  @Column('varchar', {
    unique: true,
    nullable: false,
    name: 'username'
  })
  username: string;

  @Column('varchar', {
    unique: true,
    nullable: false
  })
  email: string;

  @Column('varchar', {
    select: false,
    nullable: false
  })
  password: string;

  @Column('varchar', {
    name: 'first_name'
  })
  firstName: string;

  @Column('varchar', {
    name: 'last_name'
  })
  lastName: string;

  @Column('varchar', {
    name: 'user_img',
    default: ''
  })
  userImg: string;

  @Column('date', {
    nullable: true
  })
  birthdate: Date;

  @Column('timestamp without time zone', {
    name: 'last_login',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true
  })
  lastLogin: Date;

  @Column('bool', {
    default: false,
    name: 'is_extern_account'
  })
  isExternAccount: boolean;

  @Column('bool', {
    default: true,
    name: 'is_active'
  })
  isActive: boolean;

  @Column('varchar', {
    name: 'created_by',
    nullable: false
  })
  createdBy: string

  @Column('timestamp without time zone', {
    name: 'created_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date

  @Column('varchar', {
    name: 'updated_by',
    nullable: false
  })
  updatedBy: string

  @Column('timestamp without time zone', {
    name: 'updated_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date


  @BeforeInsert()
  @BeforeUpdate()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
    this.username = this.username.toLowerCase().trim();
    this.createdAt = new Date(new Date().toLocaleString('en-us'));
    this.updatedAt = new Date(new Date().toLocaleString('en-us'));
  }

  @AfterUpdate()
  updatedTableRegister() {
    this.updatedAt = new Date(new Date().toLocaleString('en-us'));
  }


}