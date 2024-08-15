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
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CategoriesService } from './categories.service';
import { JsonContentGuard } from 'src/common/guards/json-content.guard';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('api/v1.0/admin/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Get()
  @UseGuards(JwtGuard, AuthGuard, AdminGuard)
  async getCategories(@Res() res: Response, @Query('q') search = null) {
    const result = await this.categoriesService.index(search);

    return res.status(HttpStatus.OK).json({
      status: true,
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: result,
    });
  }

  @Post()
  @UseGuards(JsonContentGuard, JwtGuard, AuthGuard, AdminGuard)
  async createCategory(
    @Res() res: Response,
    @Body(ValidationPipe) body: CreateCategoryDto,
  ) {
    const result = await this.categoriesService.store(body);

    return res.status(HttpStatus.CREATED).json({
      status: true,
      statusCode: HttpStatus.CREATED,
      message: 'CREATED',
      data: result,
    });
  }

  @Patch(':id')
  @UseGuards(JsonContentGuard, JwtGuard, AuthGuard, AdminGuard)
  async updateArticle(
    @Param('id') id: number,
    @Body() body: UpdateCategoryDto,
    @Res() res: Response,
  ) {
    const result = await this.categoriesService.update(Number(id), body);
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

  @Delete(':id')
  @UseGuards(JwtGuard, AuthGuard, AdminGuard)
  async deleteArticle(@Param('id') id: number, @Res() res: Response) {
    const result = await this.categoriesService.destory(Number(id));
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
