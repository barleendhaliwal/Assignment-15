import { BootMixin } from '@loopback/boot';
import { ApplicationConfig, createBindingFromClass } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import path from 'path';
import { MySequence } from './sequence';
import { BcryptHasher } from './services/hash.password.bcrypt';
import { JWTService } from './services/jwt.service';
import { AuthenticationComponent, registerAuthenticationStrategy } from '@loopback/authentication';
import { TokenServiceConstants, TokenServiceBindings, PasswordHasherBindings, UserServiceBindings } from './keys'
// import { JWTStrategy } from './authentication.strategies/jwt.strategy'
import { JWTAuthenticationComponent } from '@loopback/authentication-jwt'
import { DbDataSource } from './datasources';
import { MyCustomUserService } from './services/customUser.service';
import { JWTStrategy } from './authentication.strategies/jwt.strategy';
import { AuthorizationBindings, AuthorizationComponent } from 'loopback4-authorization';
export { ApplicationConfig };

export class Server extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    //Set up bindings
    this.setUpBindings()

    // Mount authentication system
    this.component(AuthenticationComponent);

    //to use custom strategy
    this.add(createBindingFromClass(JWTStrategy));
    registerAuthenticationStrategy(this, JWTStrategy);


    // Mount jwt component
    // this.component(JWTAuthenticationComponent);
    // this.dataSource(DbDataSource);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });
    this.component(AuthorizationComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
  setUpBindings() {
    
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher)
    this.bind(PasswordHasherBindings.ROUNDS).to(10)
    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyCustomUserService)
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService)
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(TokenServiceConstants.TOKEN_SECRET_VALUE)
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(TokenServiceConstants.TOKEN_EXPIRES_IN)

   

  }
  
}
