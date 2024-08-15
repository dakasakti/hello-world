import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ArticleModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [AuthModule, ArticleModule, UsersModule, CategoriesModule, CommentsModule],
  controllers: [AppController],
})
export class AppModule {}
