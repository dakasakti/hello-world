import { Prisma } from '@prisma/client';

export class Article implements Prisma.ArticleCreateInput {
  id?: number;
  title: string;
  content: string;
  image?: string;
  user_id: number;
  category_id?: number;
  created_at?: Date;
  updated_at?: Date;
  user?: Prisma.UserCreateNestedOneWithoutArticlesInput;
  category?: Prisma.CategoryCreateNestedOneWithoutArticlesInput;
  comments?: Prisma.CommentCreateNestedManyWithoutArticleInput;
}
