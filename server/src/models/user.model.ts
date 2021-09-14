import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Customer} from './customer.model';
import {Role} from './role.model';
import {Permissions} from 'loopback4-authorization'
import { IAuthUser } from 'loopback4-authentication';
@model({
  settings: {
    foreignKeys: {
      fk_user_customerId: {
        name: 'fk_user_customerId',
        entity: 'Customer',
        entityKey: 'id',
        foreignKey: 'customerid'
      },
      fk_user_roleId:{
        name: 'fk_user_roleId',
        entity: 'Role',
        entityKey: 'key',
        foreignKey: 'roleid'
      }
    },
  },
})

export class User extends Entity  implements IAuthUser{
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    name: 'first_name' //naming convention for postgres is lower_case_with_underscores
  })
  firstName: string;

  @property({
    type: 'string',
    name: 'middle_name'
  })
  middleName?: string;

  @property({
    type: 'string',
    required: true,
    name: 'last_name'
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
    name: 'phone_number'
  })
  phoneNumber: string;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;




  @belongsTo(() => Customer)
  customerId: number;

  @belongsTo(() => Role)
  roleId: number;

  constructor(data?: Partial<User>) {
    super(data);
  }
  username: string;
}

export interface UserRelations {
  // describe navigational properties here
 
}


