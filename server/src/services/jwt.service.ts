import { HttpErrors } from '@loopback/rest'
import { promisify } from 'util'
import { UserProfile, securityId } from '@loopback/security'
import { inject } from '@loopback/core'
import { TokenService } from '@loopback/authentication'
import { TokenServiceBindings } from '../keys'
const jwt = require('jsonwebtoken')
const signAsync = promisify(jwt.sign)
const verifyAsync = promisify(jwt.verify)
export class JWTService implements TokenService {


    @inject(TokenServiceBindings.TOKEN_SECRET)
    public readonly jwtSecret: string;
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    public readonly jwtExpiresIn: string;
    async generateToken(userProfile: any): Promise<string> {

        if (!userProfile) {
            throw new HttpErrors.Unauthorized("Error while generating token: User Profile is null")
        }
        let token = '';
        try {
           
            token = signAsync(userProfile.toJSON(), this.jwtSecret, {
                expiresIn: this.jwtExpiresIn
            })
        }
        catch (err) {
            throw new HttpErrors.Unauthorized(`Error while generating token: ${err}`)
        }
        return token;
    }
    async verifyToken(token: string): Promise<UserProfile> {
        if (!token) {
            throw new HttpErrors.Unauthorized(`Error Verifying Token: 'Token' is null`)
        }
        let userProfile: UserProfile
        try {
            const decryptedToken = await verifyAsync(token, this.jwtSecret)
            userProfile = {
                id: decryptedToken.id,
                [securityId]: "",
                name: decryptedToken.name
            }
        }
        catch (err) {
            throw new HttpErrors.Unauthorized(`Error while Verifying Token: Token Not Valid`)
        }
        return userProfile
    }

}