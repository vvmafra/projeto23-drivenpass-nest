import { Body, Controller, Delete, UseGuards } from '@nestjs/common';
import { EraseService } from './erase.service';
import { DeleteUserDto } from './dto/deleteUser.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { Users } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('erase')
export class EraseController {

    constructor(private readonly eraseService: EraseService) { }

    @Delete()
    async deleteUser(@Body() deleteUserDto: DeleteUserDto, @User() user: Users) {
        return await this.eraseService.deleteUser(deleteUserDto, user)
    }
}
