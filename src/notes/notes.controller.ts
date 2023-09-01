import { Controller, Get, Post, Body, Param, UseGuards, UnauthorizedException, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { CreateNotesDto } from './dto/create-notes.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { Users } from '@prisma/client';
import { NotesService } from './notes.service';

@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) { }


  @Post()
  async create(@Body() createNotesDto: CreateNotesDto, @User() user: Users) {
    return await this.notesService.create(createNotesDto, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@User() user: Users) {
    return await this.notesService.findAll(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number, @User() user: Users) {
    return await this.notesService.findOne(id, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @User() user: Users) {
    return await this.notesService.remove(id, user)
  }
}
