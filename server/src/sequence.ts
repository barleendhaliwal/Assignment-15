import { JWTService } from './services/jwt.service';
import { inject } from '@loopback/context';
import { repository } from '@loopback/repository';
import {
    FindRoute,
    HttpErrors,
    InvokeMethod,
    ParseParams,
    Reject,
    RequestContext,
    RestBindings,
    Send,
    SequenceHandler,
    MiddlewareSequence,
    SequenceActions
} from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import {
    AuthorizationBindings,
    AuthorizeErrorKeys,
    AuthorizeFn,
    UserPermissionsFn,
} from 'loopback4-authorization';
import { UserServiceBindings, TokenServiceBindings } from './keys';
import { UserRepository, RoleRepository } from './repositories';
import { MyCustomUserService } from './services/customUser.service';
import { Role, User } from './models';

export class MySequence implements SequenceHandler {
    constructor(
        @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
        @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
        @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
        @inject(SequenceActions.SEND) public send: Send,
        @inject(SequenceActions.REJECT) public reject: Reject,
        @repository(UserRepository) protected userRepository: UserRepository,
        @repository(RoleRepository) protected roleRepository: RoleRepository,
        @inject(AuthorizationBindings.AUTHORIZE_ACTION)
        protected checkAuthorisation: AuthorizeFn,
        @inject(UserServiceBindings.USER_SERVICE)
        public userService: MyCustomUserService,
        @inject(TokenServiceBindings.TOKEN_SERVICE)
        public jwtService: JWTService,
    ) { }

    async handle(context: RequestContext) {
        const requestTime = Date.now();
        try {
            const { request, response } = context;

            response.header('Access-Control-Allow-Origin', '*');
            response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            response.header('Access-Control-Allow-Methods', '*');
            // response.status(200);
            const route = this.findRoute(request);
            const args = await this.parseParams(request, route);
            request.body = args[args.length - 1];

            console.log("hit", request.headers);
            let permissions: any = ["general"];

            if (request.method == "OPTIONS") {
                response.status(200);
            }
            if (request.headers.authorization) {

                const userToken = request.headers.authorization.split(" ")[1]; //get token

                const userProfile: UserProfile = await this.jwtService.verifyToken(userToken);

                const user: User = await this.userRepository.findById(userProfile.id);

                //get the role permissions from user 

                // "generalAuth",
                // "advancedAuth",
                // "completeAuth"

                const role: Role = await this.roleRepository.findById(user.roleId);

                console.log("role", role)
                if (role.permissions.length>0) {
                    permissions = [...permissions, ...role.permissions]
                }



            }

            console.log("permissions", permissions);
            const isAccessAllowed: boolean = await this.checkAuthorisation(
                permissions, // do authUser.permissions if using method #1
                request,
            );

            console.log("isaccess-allowed", isAccessAllowed);

            if (!isAccessAllowed) {
                throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
            }

            const result = await this.invoke(route, args);
            this.send(response, result);
        } catch (err) {
            this.reject(context, err);
        }
    }
}
