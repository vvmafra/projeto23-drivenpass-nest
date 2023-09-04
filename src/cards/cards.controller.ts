import { Controller, Get, Post, Body, Param, UseGuards, UnauthorizedException, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardsDto } from './dto/create-cards.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { Users } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags("Cards")
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) { }


  @Post()
  @ApiOperation({
    summary: "Register card",
    description: "Register a card for user"
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Card successfully registered."
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "You need to inform a title, a card number, a name, a cvc, an expiration date, a password, if is virtual, and its type."
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "Card Title already registered by this user."
  })
  
  async create(@Body() createCardsDto: CreateCardsDto, @User() user: Users) {
    return await this.cardsService.create(createCardsDto, user);
  }

  @Get()
  @ApiOperation({
    summary: "Get cards",
    description: "Show cards from this user"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Got cards with success."
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "This user has no cards."
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@User() user: Users) {
    return await this.cardsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({
    summary: "Get card",
    description: "Show card from this user by its id"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Got card with success."
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "User not allowed to get this card."
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "This card id does not exist."
  })
  @ApiParam({
    name: "id",
    description: "Card id",
    example: 1
  })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number, @User() user: Users) {
    return await this.cardsService.findOne(id, user);
  }

  @Delete(':id')
  @ApiOperation({
    summary: "Delete card",
    description: "Delete card from this user by its id"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successfully deleted card."
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "User not allowed to delete this card."
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "This card id does not exist."
  })
  @ApiParam({
    name: "id",
    description: "Card id",
    example: 1
  })
  async delete(@Param('id') id: number, @User() user: Users) {
    return await this.cardsService.remove(id, user)
  }
}
