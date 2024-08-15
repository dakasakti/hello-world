import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export class JsonContentGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const contentType = request.headers['content-type'];

    if (contentType && contentType === 'application/json') {
      return true;
    }

    throw new HttpException(
      'Content-Type must be application/json',
      HttpStatus.NOT_ACCEPTABLE,
    );
  }
}
