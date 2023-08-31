import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService
        ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest() // getting object from request
        const { authorization } = request.headers

        //validation
        try {
            const data = this.authService.checkToken((authorization ?? "").split(" ")[1]); // token é legítimo?
            const user = await this.usersService.userById(parseInt(data.sub))
            request.user = user // inserting user in request or answer
            return true
        } catch (error) {
            throw new UnauthorizedException("Unathorized access")
        }
    }
}