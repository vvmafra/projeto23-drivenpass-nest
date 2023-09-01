import { BadRequestException, ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { CredentialsRepository } from './credentials.repository';
import { Users } from '@prisma/client';

@Injectable()
export class CredentialsService {

  private readonly cryptr: any;

  constructor(private readonly repository: CredentialsRepository) {
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr('password')
  }

  async create(createCredentialDto: CreateCredentialDto, user_info: Users) {
    const { title, url, user ,password } = createCredentialDto

    if (!title || !url || !user || !password) throw new BadRequestException("You need to insert a title, url, user and password")

    const checkTitleThisUser = await this.repository.findOneTitleUser(createCredentialDto.title, user_info.id)
    if (checkTitleThisUser.length > 0) throw new ConflictException(`Title already register for this user`) 

    const credentialCrypted = { ...createCredentialDto,
      password: this.cryptr.encrypt(password)
    }

    return await this.repository.create(credentialCrypted, user_info.id)
  }

  async findAll(user: Users) {
    const userId = user.id

    const userCredentials = await this.repository.findAllUser(userId)
    if (!userCredentials) throw new NotFoundException("No Credentials found for this user")

    const decryptedCredentials = userCredentials.map(credential => ({
      ...credential,
      password: this.cryptr.decrypt(credential.password)
    }));

    return decryptedCredentials
  }

  async findOne(id: number, user: Users) {
    const userId = user.id

    const findCredentialById = await this.repository.findOneId(id)
    if (!findCredentialById) throw new NotFoundException("Id not found")
    if (findCredentialById.userId !== userId) throw new ForbiddenException("You are not allowed to access this credential")

    const decryptedCredential = {
      ...findCredentialById,
      password: this.cryptr.decrypt(findCredentialById.password)
    }

    return decryptedCredential
  }

  async remove(id: number, user: Users) {
    const userId = user.id

    const findCredentialById = await this.repository.findOneId(id)
    if (!findCredentialById) throw new NotFoundException("Id not found")
    if (findCredentialById.userId !== userId) throw new ForbiddenException("You are not allowed to access this credential")
    
    return this.repository.remove(id)
  }
}
