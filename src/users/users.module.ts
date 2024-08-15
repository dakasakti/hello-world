import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { RevokedTokensService } from 'src/revoked-tokens/revoked-tokens.service';
import { ImageService } from 'src/image/image.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, RevokedTokensService, PrismaService, ImageService],
})
export class UsersModule {}
