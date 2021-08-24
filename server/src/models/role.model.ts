import {Entity, model, property, hasOne, hasMany} from '@loopback/repository';
import { User } from './user.model';
import {Permissions} from 'loopback4-authorization'

@model()
export class Role extends Entity implements Permissions<string>{
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  key?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;
  @property({
    type: 'array',
    itemType: 'string',
  })
  permissions: string[];

  @hasMany(() => User)
  users: User[];

  constructor(data?: Partial<Role>) {
    super(data);
  }

}

export interface RoleRelations {
  // describe navigational properties here
}

