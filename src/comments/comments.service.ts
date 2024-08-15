import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './comments.model';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}
  async store(
    user_id: number,
    { content, article_id }: CreateCommentDto,
    status: boolean = false,
  ): Promise<Comment> {
    const data = {
      user_id,
      content,
      article_id,
      status,
    };

    return this.prisma.comment.create({ data });
  }

  async index(article_id: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const query: any = {
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        content: true,
        status: true,
        created_at: true,
        updated_at: true,
        user: {
          select: {
            username: true,
            name: true,
            image: true,
          },
        },
      },
      where: {
        article_id,
        status: false,
      },
    };

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany(query),
      this.prisma.comment.count({
        where: {
          ...query.where,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      comments,
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
    return this.prisma.comment.findUnique({
      where: { id },
    });
  }

  async updateStatus(id: number): Promise<Comment> {
    const comment = await this.show(id);
    if (!comment) {
      throw new NotFoundException();
    }

    if (comment.status) {
      throw new ForbiddenException();
    }

    return this.prisma.comment.update({
      where: { id },
      data: { status: true },
    });
  }
}
