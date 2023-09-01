import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { CardsRepository } from './cards.repository';

@Module({
  imports: [UsersModule],
  controllers: [CardsController],
  providers: [CardsService, CardsRepository],
})
export class CardsModule { }
