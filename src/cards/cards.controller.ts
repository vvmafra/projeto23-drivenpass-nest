import { Controller, Get, Post, Body, Param, UseGuards, UnauthorizedException, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardsDto } from './dto/create-cards.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { Users } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) { }


  @Post()
  async create(@Body() createCardsDto: CreateCardsDto, @User() user: Users) {
    return await this.cardsService.create(createCardsDto, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@User() user: Users) {
    return await this.cardsService.findAll(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number, @User() user: Users) {
    return await this.cardsService.findOne(id, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @User() user: Users) {
    return await this.cardsService.remove(id, user)
  }
}
