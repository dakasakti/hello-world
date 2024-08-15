import {
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
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { JsonContentGuard } from 'src/common/guards/json-content.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtPayload } from 'src/auth/dto/payload.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ImageService } from 'src/image/image.service';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('api/v1.0')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private imageService: ImageService,
  ) {}

  @Post('auth/register')
  @UseGuards(JsonContentGuard)
  async register(
    @Body(ValidationPipe) body: CreateUserDto,
    @Res() res: Response,
  ) {
    const result = await this.userService.store(body);

    return res.status(HttpStatus.CREATED).json({
      status: true,
      message: 'CREATED',
      data: plainToClass(UserDto, result),
    });
  }

  @Patch('auth/profile')
  @UseGuards(JsonContentGuard, JwtGuard, AuthGuard)
  async update(
    @Body(ValidationPipe) body: UpdateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (body.image) {
      const isValid = await this.imageService.isValidImageUrl(body.image);
      if (!isValid) {
        delete body.image;
      }
    }

    const { id } = req.user as JwtPayload;
    const result = await this.userService.update(id, body);
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
      data: plainToClass(UserDto, result),
    });
  }

  @Get('admin/users')
  @UseGuards(JwtGuard, AuthGuard, AdminGuard)
  async getUsers(
    @Res() res: Response,
    @Query('page') page = 1,
    @Query('limit') limit = 5,
    @Query('q') search = null,
  ) {
    const result = await this.userService.index(page, limit, search);

    return res.status(HttpStatus.OK).json({
      status: true,
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: result,
    });
  }

  @Patch('admin/users/:username/upgrade')
  @UseGuards(JwtGuard, AuthGuard, AdminGuard)
  async updateAsAdmin(
    @Res() res: Response,
    @Param('username') username: string,
  ) {
    const result = await this.userService.updateAsAdmin(username);
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
