import { Prisma } from '@prisma/client';

export class Comment implements Prisma.CommentCreateInput {
  id?: number;
  content: string;
  user_id: number;
  article_id: number;
  status?: boolean;
  created_at?: Date;
  updated_at?: Date;
  user?: Prisma.UserCreateNestedOneWithoutCommentsInput;
  article?: Prisma.ArticleCreateNestedOneWithoutCommentsInput;
}
