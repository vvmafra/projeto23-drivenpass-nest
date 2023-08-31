import { Controller, Get, Post, Body, Param, UseGuards, UnauthorizedException, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { Users } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) { }


  @Post()
  async create(@Body() createCredentialDto: CreateCredentialDto, @User() user: Users) {
    return await this.credentialsService.create(createCredentialDto, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@User() user: Users) {
    return await this.credentialsService.findAll(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number, @User() user: Users) {
    return await this.credentialsService.findOne(id, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @User() user: Users) {
    return await this.credentialsService.remove(id, user)
  }
}
