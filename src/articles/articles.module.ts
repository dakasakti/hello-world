import { Module } from '@nestjs/common';
import { ArticleController } from './articles.controller';
import { ArticleService } from './articles.service';
import { PrismaService } from 'src/prisma.service';
import { RevokedTokensService } from 'src/revoked-tokens/revoked-tokens.service';
import { ImageService } from 'src/image/image.service';
import { CategoriesService } from 'src/categories/categories.service';

@Module({
  controllers: [ArticleController],
  providers: [
    PrismaService,
    ArticleService,
    RevokedTokensService,
    ImageService,
    CategoriesService,
  ],
})
export class ArticleModule {}
