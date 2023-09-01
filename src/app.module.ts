import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CredentialsModule } from './credentials/credentials.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { NotesModule } from './notes/notes.module';
import { CardsModule } from './cards/cards.module';
import { EraseModule } from './erase/erase.module';

@Module({
  imports: [UsersModule, PrismaModule, CredentialsModule, AuthModule, NotesModule, CardsModule, EraseModule],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
