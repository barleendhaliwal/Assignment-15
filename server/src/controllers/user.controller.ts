import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import { User } from '../models';
import { Credentials, UserRepository } from '../repositories';
import * as _ from 'lodash'
import { validateCredentials } from '../services/validator';
import { inject } from '@loopback/core';
import { BcryptHasher } from '../services/hash.password.bcrypt';
import { CredentialsRequestBody } from './specs/user.controller.spec';
import { JWTService } from '../services/jwt.service';
import { authenticate } from '@loopback/authentication'
import { UserServiceBindings, PasswordHasherBindings, TokenServiceBindings } from '../keys';
import { MyCustomUserService } from '../services/customUser.service';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../authorization/authorization-permission-key';

export class UserController {

  constructor(@inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: JWTService,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER) public hasher: BcryptHasher,
    @inject(UserServiceBindings.USER_SERVICE) public myCustomUserService: MyCustomUserService
  ) { }

  @post('/users/signup', {
    responses: {
      '200': {
        description: "User",
        content: { 'application/json': { schema: getModelSchemaRef(User) } },
      }

    }
  })
  @authorize({permissions:[PermissionKey.SignUp]})
  async signUp(@requestBody() userData: User) {


    validateCredentials(_.pick(userData, ['email', 'password']))
    //encrypt password
    userData.password = await this.hasher.hashPassword(userData.password)
    const savedUser = await this.userRepository.create(userData)
    // delete savedUser.password; - doesn't work because savedUser is of type user and user has passowrd as required
    const userValuesToReturn = {
      id: savedUser.id,
      firstName: savedUser.firstName,
      middleName: savedUser.middleName,
      lastName: savedUser.lastName,
      phoneNumber: savedUser.phoneNumber,
      email: savedUser.email,
      customerId: savedUser.customerId,
      roleId: savedUser.roleId
    }
    return userValuesToReturn;
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: "Token",
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string'
                }
              }
            }
          }
        },
      }

    }
  })
  @authorize({permissions:[PermissionKey.LogIn]})
  async login(@requestBody(CredentialsRequestBody) credentials: Credentials): Promise<{ token: string }> {

    //check if user is valid
    const user = await this.myCustomUserService.verifyCredentials(credentials)
    const userProfile = this.myCustomUserService.convertToUserProfile(user)
    //generate token
    const token = await this.jwtService.generateToken(userProfile)
    return { token: token }
  }
  @post('/users')
  @authenticate('jwt')
  @authorize({ permissions: [PermissionKey.CreateUser] })
  @response(200, {
    description: 'User model instance',
    content: { 'application/json': { schema: getModelSchemaRef(User) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.userRepository.create(user);
  }

  @get('/users/count')
  @authenticate('jwt')
  @authorize({ permissions: [PermissionKey.ViewUser] })
  @response(200, {
    description: 'User model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users')
  @authenticate('jwt')
  @authorize({ permissions: [PermissionKey.ViewUser] })
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users')
  @authenticate('jwt')
  @authorize({ permissions: [PermissionKey.UpdateUser] })
  @response(200, {
    description: 'User PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, { partial: true }),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}')
  @authenticate('jwt')
  @authorize({ permissions: [PermissionKey.ViewUser] })
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(User, { exclude: 'where' }) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @authenticate('jwt')
  @authorize({ permissions: [PermissionKey.UpdateUser] })
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, { partial: true }),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}')
  @authenticate('jwt')
  @authorize({ permissions: [PermissionKey.UpdateUser] })
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  @authenticate('jwt')
  @authorize({ permissions: [PermissionKey.DeleteUser] })
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
