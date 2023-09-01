import { Injectable } from '@nestjs/common';
import { CreateNotesDto } from './dto/create-notes.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotesRepository {

  constructor(private readonly prisma: PrismaService) { }

  create(createNotesDto: CreateNotesDto, userId: number) {
    const { title, text } = createNotesDto
    return this.prisma.notes.create({
      data: {
        title,
        text,
        userId
      }
    })
  }

  findAllUser(userId: number) {
    return this.prisma.notes.findMany({
      where: {
        userId
      }
    })
  }

  findOneTitleUser(title: string, userId: number) {
    return this.prisma.notes.findMany({
      where: {
        title,
        userId
      }
    })
  }

  findOneId(id: number) {
    return this.prisma.notes.findUnique({
      where: {
        id: Number(id)
      }
    })
  }

  remove(id: number) {
    return this.prisma.notes.delete({
      where: {
        id: Number(id)
      }
    })
  }
}
