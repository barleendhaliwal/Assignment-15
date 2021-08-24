import { authenticate } from '@loopback/authentication';
import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../authorization/authorization-permission-key';
import {
  User,
  Customer,
} from '../models';
import {UserRepository} from '../repositories';
@authenticate('jwt')
export class UserCustomerController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }
  @authorize({permissions:[PermissionKey.ViewCustomer]})
  @get('/users/{id}/customer', {
    responses: {
      '200': {
        description: 'Customer belonging to User',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Customer)},
          },
        },
      },
    },
  })
  async getCustomer(
    @param.path.number('id') id: typeof User.prototype.id,
  ): Promise<Customer> {
    return this.userRepository.customer(id);
  }
}
