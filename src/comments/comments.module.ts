import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { PrismaService } from 'src/prisma.service';
import { RevokedTokensService } from 'src/revoked-tokens/revoked-tokens.service';
import { ArticleService } from 'src/articles/articles.service';

@Module({
  controllers: [CommentsController],
  providers: [
    CommentsService,
    PrismaService,
    RevokedTokensService,
    ArticleService,
  ],
})
export class CommentsModule {}
