import { UserService } from '@loopback/authentication'
import { UserProfile,securityId } from '@loopback/security';
import { User } from '../models/user.model';
import { Credentials, UserRepository } from '../repositories/user.repository';
import { repository } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import { inject } from '@loopback/core';
import { BcryptHasher } from './hash.password.bcrypt';
import { PasswordHasherBindings } from '../keys';

export class MyCustomUserService implements UserService<User, Credentials>{

    constructor(@repository(UserRepository) public userRepository: UserRepository, @inject(PasswordHasherBindings.PASSWORD_HASHER) public hasher: BcryptHasher
    ) {

    }
    async verifyCredentials(credentials: Credentials): Promise<User> {
        const foundUser = await this.userRepository.findOne({
            where: {
                email: credentials.email
            }
        })
        if (!foundUser) {
            throw new HttpErrors.NotFound(`No user with this email ${credentials.email} `)
        }
        const passwordMatched = await this.hasher.comparePassword(credentials.password, foundUser.password)
        if (!passwordMatched) {
            throw new HttpErrors.Unauthorized("Password is not Valid");
        }
        return foundUser
    }
    convertToUserProfile(user: User): UserProfile {
        const profileName = user.firstName + user.middleName + user.lastName;
        return {
            id:user.id,
            [securityId]:"",
            name:profileName
        }

    }
    log(){
        console.log(' zsdncvksn')
    }
    

}