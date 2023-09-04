import { Controller, Get, Post, Body, Param, UseGuards, UnauthorizedException, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { CreateNotesDto } from './dto/create-notes.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { Users } from '@prisma/client';
import { NotesService } from './notes.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags("Notes")
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) { }


  @Post()
  @ApiOperation({
    summary: "Register a note",
    description: "Register a note for user"
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Note successfully registered."
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "You need to inform a title and a text."
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "Note Title already registered by this user."
  })
  async create(@Body() createNotesDto: CreateNotesDto, @User() user: Users) {
    return await this.notesService.create(createNotesDto, user);
  }

  @Get()
  @ApiOperation({
    summary: "Get notes",
    description: "Show notes from this user"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Got notes with success."
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "This user has no notes."
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@User() user: Users) {
    return await this.notesService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({
    summary: "Get note",
    description: "Show note from this user by its id"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Got note with success."
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "User not allowed to get this note."
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "This note id does not exist."
  })
  @ApiParam({
    name: "id",
    description: "Note id",
    example: 1
  })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number, @User() user: Users) {
    return await this.notesService.findOne(id, user);
  }

  @Delete(':id')
  @ApiOperation({
    summary: "Delete note",
    description: "Delete note from this user by its id"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successfully deleted note."
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "User not allowed to delete this note."
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "This note id does not exist."
  })
  @ApiParam({
    name: "id",
    description: "Note id",
    example: 1
  })
  async delete(@Param('id') id: number, @User() user: Users) {
    return await this.notesService.remove(id, user)
  }
}
