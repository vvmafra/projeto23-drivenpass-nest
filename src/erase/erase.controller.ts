import { Body, Controller, Delete, HttpStatus, UseGuards } from '@nestjs/common';
import { EraseService } from './erase.service';
import { DeleteUserDto } from './dto/deleteUser.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { Users } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('erase')
@ApiTags("Erase")
export class EraseController {

    constructor(private readonly eraseService: EraseService) { }

    @Delete()
    @ApiOperation({
        summary: "Delete an user",
        description: "Delete an user and its cards, credentials and notes"
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "User successfully deleted"
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "Email or password incorrect."
    })
    async deleteUser(@Body() deleteUserDto: DeleteUserDto, @User() user: Users): Promise<{ id: number; email: string; password: string; }> {
        return await this.eraseService.deleteUser(deleteUserDto, user)
    }
}
