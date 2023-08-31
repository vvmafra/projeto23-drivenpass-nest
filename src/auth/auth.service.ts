import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { Users } from '@prisma/client';

@Injectable()
export class AuthService {

    private EXPIRATION_TIME = "10 days";
    private ISSUER = "Victor";
    private AUDIENCE = "users";

    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService) { }

    async signUp(signUpDto: SignUpDto) {
        return await this.usersService.createUser(signUpDto)
    }

    async signIn(signInDto: SignInDto) {
        const { email, password } = signInDto

        const user = await this.usersService.userByEmail(email)
        if (!user) throw new UnauthorizedException("Email or password invalid")

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) throw new UnauthorizedException("Email or password invalid")

        return this.createToken(user)
    }
    private async createToken(user: Users) {
        const { id, email } = user

        const token = this.jwtService.sign({ id, email }, {
            expiresIn: this.EXPIRATION_TIME,
            subject: String(id),
            issuer: this.ISSUER,
            audience: this.AUDIENCE
        })

        return { token }
    }

    checkToken(token: string){
        try {
            const data = this.jwtService.verify(token, {
                audience: this.AUDIENCE,
                issuer: this.ISSUER
            })
            return data
        } catch(error) {
            console.log(error)
            throw new BadRequestException(error)
        }
    }
}
