import { Injectable } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CredentialsRepository {

  private readonly cryptr: any;

  constructor(private readonly prisma: PrismaService) {
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr('password')
   }

  async create(createCredentialDto: CreateCredentialDto, encryptedPassword: any, userId: number) {
    const {title, url, user} = createCredentialDto
    return await this.prisma.credentials.create({
      data: {
        title,
        url,
        user,
        password: encryptedPassword,
        userId //pegar esse userId de algum lugar
      }
    })
  }

  async findAll(userId: number) {
    return await this.prisma.credentials.findMany({
      where: {
        userId
      }
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} credential`;
  }

  remove(id: number) {
    return `This action removes a #${id} credential`;
  }
}
