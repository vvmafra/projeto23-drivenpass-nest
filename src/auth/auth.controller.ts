import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags("Auth")
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('/sign-up')
    @ApiOperation({
        summary: "Register an user",
        description: "Use to register an user"
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "User successfully registered."
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Password not strong enough. You need at least 10 characters, one symbol, one number, one upper case and one lower case."
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: "Email already user in another register"
    })

    signUp(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto)
    }

    @Post('/sign-in')
    @ApiOperation({
        summary: "Login an user",
        description: "Use to login with an account already registered"
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "User successfully logged in."
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "Email or password incorrect."
    })
    @HttpCode(HttpStatus.OK)
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto)
    }
}
