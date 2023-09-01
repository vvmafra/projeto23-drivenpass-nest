import { Module } from '@nestjs/common';
import { EraseService } from './erase.service';
import { EraseController } from './erase.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { CredentialsModule } from '../credentials/credentials.module';
import { CardsModule } from '../cards/cards.module';
import { NotesModule } from '../notes/notes.module';
import { CredentialsService } from '../credentials/credentials.service';
import { CardsService } from '../cards/cards.service';
import { NotesService } from '../notes/notes.service';
import { UsersService } from '../users/users.service';
import { CredentialsRepository } from '../credentials/credentials.repository';
import { CardsRepository } from '../cards/cards.repository';
import { NotesRepository } from '../notes/notes.repository';
import { UsersRepository } from '../users/users.repository';

@Module({
  imports: [UsersModule, AuthModule, CredentialsModule, CardsModule, NotesModule],
  providers: [EraseService, CredentialsService, CardsService, NotesService, UsersService, CredentialsRepository, CardsRepository, NotesRepository, UsersRepository],
  controllers: [EraseController]
})
export class EraseModule {}
