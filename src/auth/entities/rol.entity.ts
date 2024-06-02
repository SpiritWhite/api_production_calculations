import { randomUUID } from 'node:crypto';
import {
  Entity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  AfterUpdate,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { User } from './';

@Entity('roles', {})
export class Rol {

  @Column('uuid', {
    name: 'rol_id',
    primary: true,
    default: randomUUID(),

  })
  rolId?: string;

  @Column('varchar', {
    name: 'rol_name',
    nullable: false,
    unique: true
  })
  rolName: string;

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