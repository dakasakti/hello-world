import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { JsonContentGuard } from 'src/common/guards/json-content.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ArticleService } from 'src/articles/articles.service';
import { JwtPayload } from 'src/auth/dto/payload.dto';
import { CommentsService } from './comments.service';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('api/v1.0')
export class CommentsController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly commentService: CommentsService,
  ) {}
  @Post('comments')
  @UseGuards(JsonContentGuard, JwtGuard, AuthGuard)
  async createComment(
    @Req() req: Request,
    @Res() res: Response,
    @Body(ValidationPipe) body: CreateCommentDto,
  ) {
    const article = await this.articleService.show(body.article_id);
    if (!article) {
      throw new BadRequestException('article_id is wrong');
    }

    const { id, is_admin } = req.user as JwtPayload;
    await this.commentService.store(id, body, is_admin);

    return res.status(HttpStatus.CREATED).json({
      status: true,
      statusCode: HttpStatus.CREATED,
      message: 'CREATED',
      data: null,
    });
  }

  @Get('admin/articles/:id/comments')
  @UseGuards(JwtGuard, AuthGuard, AdminGuard)
  async getCommentsByArticle(
    @Param('id') articleId: number,
    @Res() res: Response,
    @Query('page') page = 1,
    @Query('limit') limit = 5,
  ) {
    const article = await this.articleService.show(Number(articleId));
    if (!article) {
      throw new BadRequestException('article_id is wrong');
    }

    const result = await this.commentService.index(
      article.id,
      Number(page),
      Number(limit),
    );

    return res.status(HttpStatus.OK).json({
      status: true,
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: result,
    });
  }

  @Patch('admin/comments/:id/approve')
  @UseGuards(JwtGuard, AuthGuard, AdminGuard)
  async updateCommentStatus(@Param('id') id: number, @Res() res: Response) {
    const result = await this.commentService.updateStatus(Number(id));

    if (!result) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'INTERNAL_SERVER_ERROR',
        data: null,
      });
    }

    return res.status(HttpStatus.NO_CONTENT).json();
  }
}
