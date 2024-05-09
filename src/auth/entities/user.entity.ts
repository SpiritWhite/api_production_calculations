import {
  AfterUpdate,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity
} from 'typeorm';

@Entity('users', {
  schema: 'security'
})
export class User {

  @Column('uuid', {
    name: 'user_id',
    primary: true
  })
  userId?: string;

  @Column('varchar', {
    unique: true,
    name: 'username'
  })
  username: string;

  @Column('varchar', {
    unique: true
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

  @Column('date')
  birthdate: Date;

  @Column('bool', {
    default: false,
    name: 'is_admin'
  })
  isAdmin: boolean;

  @Column('bool', {
    default: false,
    name: 'is_google_account'
  })
  isGoogleAccount: boolean;

  @Column('bool', {
    default: true,
    name: 'is_online'
  })
  isOnline: boolean;

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

  @Column('time without time zone', {
    name: 'created_at',
    nullable: false
  })
  createdAt: Date

  @Column('varchar', {
    name: 'updated_by',
    nullable: false
  })
  updatedBy: string

  @Column('time without time zone', {
    name: 'updated_at',
    nullable: false
  })
  updatedAt: Date


  @BeforeInsert()
  @BeforeUpdate()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
    this.username = this.username.toLowerCase().trim();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @AfterUpdate()
  updatedTableRegister() {
    this.updatedAt = new Date();
  }


}