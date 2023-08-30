import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { CredentialsRepository } from './credentials.repository';

@Injectable()
export class CredentialsService {

  private readonly cryptr: any;

  constructor(private readonly repository: CredentialsRepository) { 
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr('password')
  }

  async create(createCredentialDto: CreateCredentialDto) {
    const userId = 1 // pegar userId de algum lugar
    const {title, url, user, password} = createCredentialDto

    const encryptedPassword = this.cryptr.encrypt(password)

    const newCredential = await this.repository.create(createCredentialDto, encryptedPassword, userId)

    return newCredential
  }

  async findAll() {
    const userId = 1 //pegar userId de algum lugar
    
    const userCredentials = await this.repository.findAll(userId)
    if (!userCredentials) throw new HttpException("No Credentials found for this user", HttpStatus.NOT_FOUND)

    const decryptedCredentials = userCredentials.map(credential => ({
      ...credential,
      password: this.cryptr.decrypt(credential.password),
    }));

    return decryptedCredentials
  }

  findOne(id: number) {
    return `This action returns a #${id} credential`;
  }

  remove(id: number) {
    return `This action removes a #${id} credential`;
  }
}
