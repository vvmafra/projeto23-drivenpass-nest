import { Injectable } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CredentialsRepository {

  private readonly cryptr: any;

  constructor(private readonly prisma: PrismaService) {
   }

  create(credentialCrypted: CreateCredentialDto, userId: number) {
    const {title, url, user, password} = credentialCrypted
    return this.prisma.credentials.create({
      data: {
        title,
        url,
        user,
        password,
        userId
      }
    })
  }

  findAllUser(userId: number) {
    return this.prisma.credentials.findMany({
      where: {
        userId
      }
    })
  }

  findOneTitleUser(title: string, userId: number) {
    return this.prisma.credentials.findMany({
      where: {
        title,
        userId
      }
    }) 
  }

  findOneId(id: number){
    return this.prisma.credentials.findUnique({
      where: {
        id: Number(id)
      }
    })
  }

  remove(id: number) {
    return this.prisma.credentials.delete({
      where:{
        id: Number(id)
      }
    })
  }
}
