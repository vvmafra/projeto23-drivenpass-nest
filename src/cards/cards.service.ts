import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardsDto } from './dto/create-cards.dto';
import { CardsRepository } from './cards.repository';
import { Users } from '@prisma/client';

@Injectable()
export class CardsService {

  private readonly cryptr: any;

  constructor(private readonly repository: CardsRepository) {
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr('password')
    this.cryptr = new Cryptr('cvc')
  }

  async create(createCardslDto: CreateCardsDto, user_info: Users) {
    const { title, number, name, cvc, expirationDate, password, virtual, type } = createCardslDto

    if (!title || !number || !name || !cvc || !expirationDate || !password || !type){
      throw new BadRequestException("You need to insert a title, number, name, cvc, expirationDate, password and type")
    }

    if (virtual === undefined) throw new BadRequestException("You need to insert if the card is virtual or not")

    const checkTitleThisUser = await this.repository.findOneTitleUser(createCardslDto.title, user_info.id)
    if (checkTitleThisUser.length > 0) throw new ConflictException(`Title already register for this user`)

    const cardCrypted = {
      ...createCardslDto,
      cvc: this.cryptr.encrypt(cvc),
      password: this.cryptr.encrypt(password)
    }

    return await this.repository.create(cardCrypted, user_info.id)
  }

  async findAll(user: Users) {
    const userId = user.id

    const userCards = await this.repository.findAllUser(userId)
    if (userCards.length === 0) throw new NotFoundException("No Cards found for this user")

    const decryptedCards = userCards.map(cards => ({
      ...cards,
      cvc: this.cryptr.decrypt(cards.cvc),
      password: this.cryptr.decrypt(cards.password),
    }));

    return decryptedCards
  }

  async findOne(id: number, user: Users) {
    const userId = user.id

    const findCardById = await this.repository.findOneId(id)
    if (!findCardById) throw new NotFoundException("Id not found")
    if (findCardById.userId !== userId) throw new ForbiddenException("You are not allowed to access this card")

    const decryptedCard = {
      ...findCardById,
      cvc: this.cryptr.decrypt(findCardById.cvc),
      password: this.cryptr.decrypt(findCardById.password)
    }

    return decryptedCard
  }

  async remove(id: number, user: Users) {
    const userId = user.id

    const findCardlById = await this.repository.findOneId(id)
    if (!findCardlById) throw new NotFoundException("Id not found")
    if (findCardlById.userId !== userId) throw new ForbiddenException("You are not allowed to access this card")

    return this.repository.remove(id)
  }

  async deleteMany(userId: number){
    return await this.repository.deleteMany(userId)
  }
  
}
