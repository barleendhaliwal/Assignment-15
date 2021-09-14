import { inject, Provider } from "@loopback/core";
import { repository } from "@loopback/repository";
import { HttpErrors } from "@loopback/rest";
import { AuthErrorKeys, VerifyFunction } from "loopback4-authentication";
import { UserServiceBindings } from "../keys";
import { User } from "../models";
import { UserRepository } from "../repositories";
import { MyCustomUserService } from "./customUser.service";

export class LocalPasswordVerifyProvider
  implements Provider<VerifyFunction.LocalPasswordFn> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(UserServiceBindings.USER_SERVICE) public userService:MyCustomUserService
  ) {}

  value(): VerifyFunction.LocalPasswordFn {
    return async (username: any, password: any) => {
      try {
        
        const user: User =
          await this.userService.verifyPassword(username, password);
        return user;
      } catch (error) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials)
          .message;
      }
    };
  }
}