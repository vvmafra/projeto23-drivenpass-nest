import { Controller, Get, Post, Body, Param, UseGuards, UnauthorizedException, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { Users } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags("Credentials")
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) { }


  @Post()
  @ApiOperation({
    summary: "Register credential",
    description: "Register a credential for user"
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Credential successfully registered."
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "You need to inform a title, an url, an user and a password."
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "Credential Title already registered by this user."
  })

  async create(@Body() createCredentialDto: CreateCredentialDto, @User() user: Users) {
    return await this.credentialsService.create(createCredentialDto, user);
  }

  @Get()
  @ApiOperation({
    summary: "Get credentials",
    description: "Show credentials from this user"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Got credential with success."
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "This user has no credentials."
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@User() user: Users) {
    return await this.credentialsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({
    summary: "Get credential",
    description: "Show credential from this user by its id"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Got credential with success."
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "User not allowed to get this credential."
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "This credential id does not exist."
  })
  @ApiParam({
    name: "id",
    description: "Credential id",
    example: 1
  })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number, @User() user: Users) {
    return await this.credentialsService.findOne(id, user);
  }

  @Delete(':id')
  @ApiOperation({
    summary: "Delete credential",
    description: "Delete credential from this user by its id"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successfully deleted credential."
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "User not allowed to delete this credential."
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "This credential id does not exist."
  })
  @ApiParam({
    name: "id",
    description: "Credential id",
    example: 1
  })
  async delete(@Param('id') id: number, @User() user: Users) {
    return await this.credentialsService.remove(id, user)
  }
}
