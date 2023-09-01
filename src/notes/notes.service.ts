import { BadRequestException, ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotesDto } from './dto/create-notes.dto';
import {  NotesRepository } from './notes.repository';
import { Users } from '@prisma/client';

@Injectable()
export class NotesService {

  private readonly cryptr: any;

  constructor(private readonly repository: NotesRepository) {
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr('password')
  }

  async create(createNotesDto: CreateNotesDto, user_info: Users) {
    const { title, text } = createNotesDto

    if (!title || !text) throw new BadRequestException("You need to insert a title and a text")

    const checkTitleThisUser = await this.repository.findOneTitleUser(createNotesDto.title, user_info.id)
    if (checkTitleThisUser.length > 0) throw new ConflictException(`Title already register for this user`) 

    return await this.repository.create(createNotesDto, user_info.id)
  }

  async findAll(user: Users) {
    const userId = user.id

    const userNotes = await this.repository.findAllUser(userId)
    if (!userNotes) throw new HttpException("No Credentials found for this user", HttpStatus.NOT_FOUND)

    return userNotes
  }

  async findOne(id: number, user: Users) {
    const userId = user.id

    const findNotesById = await this.repository.findOneId(id)
    if (!findNotesById) throw new NotFoundException("Id not found")
    if (findNotesById.userId !== userId) throw new ForbiddenException("You are not allowed to access this note")

    return findNotesById
  }

  async remove(id: number, user: Users) {
    const userId = user.id

    const findNotesById = await this.repository.findOneId(id)
    if (!findNotesById) throw new NotFoundException("Id not found")
    if (findNotesById.userId !== userId) throw new ForbiddenException("You are not allowed to access this note")
    
    return this.repository.remove(id)
  }

  async deleteMany(userId: number){
    return await this.repository.deleteMany(userId)
  }
  
}
