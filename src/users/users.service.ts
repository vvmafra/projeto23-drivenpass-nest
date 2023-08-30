import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {

  constructor(private readonly repository: UsersRepository) { }

  async create(createUserDto: CreateUserDto) {
    const {email, password} = createUserDto

    const emailExist = await this.repository.findOneEmail(email)
    if (emailExist) throw new HttpException("Email already registred", HttpStatus.CONFLICT)

    const user = await this.repository.create(createUserDto)
    return user
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
