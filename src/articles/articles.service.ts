import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as lodash from 'lodash';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './articles.model';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async index(
    page: number = 1,
    limit: number = 10,
    search?: string,
    username?: string,
  ) {
    const skip = (page - 1) * limit;

    const query: any = {
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        created_at: true,
        updated_at: true,
        user: {
          select: {
            username: true,
            name: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    };

    if (username) {
      query.where = {
        user: {
          username: username,
        },
      };
    }

    if (search) {
      query.where = {
        ...query.where,
        title: {
          contains: search,
          mode: 'insensitive',
        },
      };
    }

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany(query),
      this.prisma.article.count({
        where: {
          ...query.where,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      articles,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async show(id: number) {
    return this.prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        created_at: true,
        updated_at: true,
        user: {
          select: {
            username: true,
            name: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            status: true,
            created_at: true,
            user: {
              select: {
                username: true,
                name: true,
                image: true,
              },
            },
          },
          where: {
            status: true,
          },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });
  }

  async store(
    id: number,
    { title, content, category_id = null }: CreateArticleDto,
  ): Promise<Article> {
    const data = {
      title: lodash.startCase(title),
      content,
      user_id: id,
      category_id,
    };

    // bug when data type is Article
    return this.prisma.article.create({ data });
  }

  async indexByAdmin(
    id: number,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    const query: any = {
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      where: { user_id: id },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        created_at: true,
        updated_at: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    };

    if (search) {
      query.where = {
        ...query.where,
        title: {
          contains: search,
          mode: 'insensitive',
        },
      };
    }

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany(query),
      this.prisma.article.count({
        where: {
          ...query.where,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      articles,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async showByAdmin(id: number, user_id: number): Promise<Article> {
    return this.prisma.article.findUnique({
      where: { id, user_id },
    });
  }

  async update(
    id: number,
    user_id: number,
    {
      title = null,
      content = null,
      category_id = null,
      image = null,
    }: UpdateArticleDto,
  ): Promise<Article> {
    const article = await this.showByAdmin(id, user_id);
    if (!article) {
      throw new ForbiddenException();
    }

    const data: Partial<UpdateArticleDto> = {};
    if (title) {
      data.title = lodash.startCase(title);
    }

    if (content) {
      data.content = content;
    }

    if (category_id) {
      data.category_id = category_id;
    }

    if (image) {
      data.image = image;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('At least one property must be provided');
    }

    return this.prisma.article.update({
      where: { id },
      data,
    });
  }

  async destory(id: number, user_id: number): Promise<Article> {
    const article = await this.showByAdmin(id, user_id);
    if (!article) {
      throw new ForbiddenException();
    }

    return this.prisma.article.delete({ where: { id } });
  }
}
