import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DeleteUserDto } from './dto/deleteUser.dto';
import { CredentialsService } from '../credentials/credentials.service';
import { CardsService } from '../cards/cards.service';
import { NotesService } from '../notes/notes.service';
import { UsersService } from '../users/users.service';
import { Users } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EraseService {

    constructor(
        private readonly credentialsService: CredentialsService,
        private readonly cardsService: CardsService,
        private readonly notesService: NotesService,
        private readonly usersService: UsersService
    ) { }

    async deleteUser(deleteUserDto: DeleteUserDto, user: Users) {
        const { email, password } = deleteUserDto

        const checkUser = await this.usersService.userByEmail(email)
        if (!checkUser) throw new UnauthorizedException("Email or password invalid")

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) throw new UnauthorizedException("Email or password invalid")

        await this.credentialsService.deleteMany(user.id)
        await this.cardsService.deleteMany(user.id)
        await this.notesService.deleteMany(user.id)
        const deleteUser = await this.usersService.deleteUser(user.id)

        return deleteUser
    }
}
