import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PrismaService } from 'src/prisma.service';
import { RevokedTokensService } from 'src/revoked-tokens/revoked-tokens.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService, RevokedTokensService],
})
export class CategoriesModule {}
