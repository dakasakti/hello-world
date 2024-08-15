import {
  Body,
  Controller,
  Delete,
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
import { ArticleService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { JsonContentGuard } from 'src/common/guards/json-content.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { JwtPayload } from 'src/auth/dto/payload.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { ImageService } from 'src/image/image.service';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CategoriesService } from 'src/categories/categories.service';

@Controller('api/v1.0')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly categoryService: CategoriesService,
    private readonly imageService: ImageService,
  ) {}

  @Get('articles')
  async getArticles(
    @Res() res: Response,
    @Query('page') page = 1,
    @Query('limit') limit = 5,
    @Query('q') search = null,
    @Query('username') username = null,
  ) {
    const result = await this.articleService.index(
      Number(page),
      Number(limit),
      search,
      username,
    );

    return res.status(HttpStatus.OK).json({
      status: true,
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: result,
    });
  }

  @Get('articles/:id')
  async getArticle(@Param('id') id: number, @Res() res: Response) {
    const result = await this.articleService.show(Number(id));
    if (!result) {
      return res.status(HttpStatus.NOT_FOUND).json({
        status: false,
        statusCode: HttpStatus.NOT_FOUND,
        message: 'NOT_FOUND',
        data: null,
      });
    }

    return res.status(HttpStatus.OK).json({
      status: true,
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: result,
    });
  }

  @Get('admin/articles')
  @UseGuards(JwtGuard, AuthGuard, AdminGuard)
  async getArticlesByAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page = 1,
    @Query('limit') limit = 5,
    @Query('q') search = null,
  ) {
    const { id } = req.user as JwtPayload;
    const result = await this.articleService.indexByAdmin(
      id,
      Number(page),
      Number(limit),
      search,
    );

    return res.status(HttpStatus.OK).json({
      status: true,
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: result,
    });
  }

  @Post('admin/articles')
  @UseGuards(JsonContentGuard, JwtGuard, AuthGuard, AdminGuard)
  async createArticle(
    @Req() req: Request,
    @Res() res: Response,
    @Body(ValidationPipe) body: CreateArticleDto,
  ) {
    if (body.image) {
      const isValid = await this.imageService.isValidImageUrl(body.image);
      if (!isValid) {
        delete body.image;
      }
    }

    if (body.category_id) {
      const category = await this.categoryService.show(body.category_id);
      if (!category) {
        delete body.category_id;
      }
    }

    const { id } = req.user as JwtPayload;
    const result = await this.articleService.store(id, body);

    return res.status(HttpStatus.CREATED).json({
      status: true,
      statusCode: HttpStatus.CREATED,
      message: 'CREATED',
      data: result,
    });
  }

  @Patch('admin/articles/:id')
  @UseGuards(JsonContentGuard, JwtGuard, AuthGuard, AdminGuard)
  async updateArticle(
    @Param('id') articleId: number,
    @Body() body: UpdateArticleDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (body.image) {
      const isValid = await this.imageService.isValidImageUrl(body.image);
      if (!isValid) {
        delete body.image;
      }
    }

    if (body.category_id) {
      const category = await this.categoryService.show(body.category_id);
      if (!category) {
        delete body.category_id;
      }
    }

    const { id } = req.user as JwtPayload;
    const result = await this.articleService.update(
      Number(articleId),
      id,
      body,
    );

    if (!result) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'INTERNAL_SERVER_ERROR',
        data: null,
      });
    }

    return res.status(HttpStatus.OK).json({
      status: true,
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: result,
    });
  }

  @Delete('admin/articles/:id')
  @UseGuards(JwtGuard, AuthGuard, AdminGuard)
  async deleteArticle(
    @Param('id') articleId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { id } = req.user as JwtPayload;
    const result = await this.articleService.destory(Number(articleId), id);
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
