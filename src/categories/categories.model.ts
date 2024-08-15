import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';

export class Category implements Prisma.CategoryCreateInput {
  id?: number;

  @Expose()
  name: string;

  @Expose()
  description: string;
  created_at?: Date;
  updated_at?: Date;
  articles?: Prisma.ArticleCreateNestedManyWithoutCategoryInput;
}
