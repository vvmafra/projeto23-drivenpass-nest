import { Injectable } from '@nestjs/common';
import { SignUpDto } from '../auth/dto/signup.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersRepository {

  private SALT = 10
  constructor(private readonly prisma: PrismaService) { }

  createUser(signUpDto: SignUpDto) {
    return this.prisma.users.create({
      data: {
        ...signUpDto,
        password: bcrypt.hashSync(signUpDto.password, this.SALT)
      }
    })
  }

  findOneId(id: number) {
    return this.prisma.users.findUnique({
      where: {
        id
      }
    })
  }

  findOneEmail(email: string) {
    return this.prisma.users.findUnique({
      where: {
        email
      }
    })
  }

  deleteUser(id: number) {
    return this.prisma.users.delete({
      where: {
        id: Number(id)
      }
    })
  }
}
