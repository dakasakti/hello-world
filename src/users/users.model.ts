import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';

export class User implements Prisma.UserCreateInput {
  id?: number;

  username: string;

  @Expose()
  name: string;

  email: string;

  @Expose()
  password: string;

  @Expose()
  image?: string;

  @Expose()
  bio?: string;

  is_admin?: boolean;
  created_at?: Date;
  updated_at?: Date;
  articles?: Prisma.ArticleCreateNestedManyWithoutUserInput;
  comments?: Prisma.CommentCreateNestedManyWithoutUserInput;
}
