import { Provider, ValueOrPromise } from '@loopback/context';
import { inject } from '@loopback/core';
import { HttpErrors } from '@loopback/rest';
import { IAuthUser, VerifyFunction } from 'loopback4-authentication';
import { promisify } from 'util';
import { TokenServiceBindings } from '../keys';
const jwt = require('jsonwebtoken')
const verifyAsync = promisify(jwt.verify)
import {  securityId } from '@loopback/security'


export class BearerTokenVerifyProvider
    implements Provider<VerifyFunction.BearerFn> {
    constructor(
        @inject(TokenServiceBindings.TOKEN_SECRET)
        public readonly jwtSecret: string,

        @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
        public readonly jwtExpiresIn: string
    ) { }
    value(): ValueOrPromise<VerifyFunction.BearerFn<IAuthUser>> {
        return async (token: string) => {
            let userProfile: any;
            try {
                //decode user profile from token
                const decryptedToken = await verifyAsync(token, this.jwtSecret)
                userProfile = {
                    [securityId]: decryptedToken.id,
                    name: decryptedToken.name
                }
                
            } catch (error) {
                throw new HttpErrors.Unauthorized(
                    `Error Verifying Token :${error.message}`
                )
            }
            return userProfile;
        };
    }

}