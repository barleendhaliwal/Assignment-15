import { inject } from '@loopback/core';
import { genSalt, hash, compare } from 'bcryptjs'
import { PasswordHasherBindings } from '../keys';

export interface PasswordHasher<T = string> {
    hashPassword(password: T): Promise<T>
    comparePassword(providedPassword:T,storedPassword:T):Promise<boolean>
}

export class BcryptHasher implements PasswordHasher<string> {
    async comparePassword(providedPassword: string, storedPassword: string): Promise<boolean> {
     
        const passwordMatched=await compare(providedPassword,storedPassword);
        return passwordMatched
    }
    @inject(PasswordHasherBindings.ROUNDS)
    rounds:number
    async hashPassword(password:string)
    {
        const salt=await genSalt(this.rounds)
        return await hash(password,salt);
    }
   
}