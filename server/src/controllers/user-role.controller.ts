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
  Role,
} from '../models';
import {UserRepository} from '../repositories';
@authenticate('jwt')
export class UserRoleController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  @authorize({permissions:[PermissionKey.ViewRole]})
  @get('/users/{id}/role', {
    responses: {
      '200': {
        description: 'Role belonging to User',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Role)},
          },
        },
      },
    },
  })
  async getRole(
    @param.path.number('id') id: typeof User.prototype.id,
  ): Promise<Role> {
    return this.userRepository.role(id);
  }
}
