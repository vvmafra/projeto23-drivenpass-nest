import { Injectable } from '@nestjs/common';
import { CreateCardsDto } from './dto/create-cards.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CardsRepository {

  constructor(private readonly prisma: PrismaService) {
  }

  create(credentialCrypted: CreateCardsDto, userId: number) {
    const { title, number, name, cvc, expirationDate, password, virtual, type } = credentialCrypted
    return this.prisma.cards.create({
      data: {
        title,
        number, 
        name, 
        cvc, 
        expirationDate, 
        password, 
        virtual, 
        type,
        userId
      }
    })
  }

  findAllUser(userId: number) {
    return this.prisma.cards.findMany({
      where: {
        userId
      }
    })
  }

  findOneTitleUser(title: string, userId: number) {
    return this.prisma.cards.findMany({
      where: {
        title,
        userId
      }
    })
  }

  findOneId(id: number) {
    return this.prisma.cards.findUnique({
      where: {
        id: Number(id)
      }
    })
  }

  remove(id: number) {
    return this.prisma.cards.delete({
      where: {
        id: Number(id)
      }
    })
  }
}
