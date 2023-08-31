import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { SignUpDto } from '../auth/dto/signup.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {

  constructor(private readonly repository: UsersRepository) { }

  async createUser(SignUpDto: SignUpDto) {
    const {email, password} = SignUpDto

    const emailExist = await this.repository.findOneEmail(email)
    if (emailExist) throw new ConflictException("Email already registred")

    return await this.repository.createUser(SignUpDto)
  }

  async userById(id: number) { 
    const user = await this.repository.findOneId(id)
    if (!user) throw new NotFoundException("User not found")

    return user 
  }

  async userByEmail(email: string) {
    return await this.repository.findOneEmail(email)
  }
}
