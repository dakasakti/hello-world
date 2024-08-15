import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RevokedTokensService } from 'src/revoked-tokens/revoked-tokens.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private revokeService: RevokedTokensService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];

    const token = authorization.split(' ')[1];
    const result = await this.revokeService.isTokenBlacklisted(token);
    if (result) {
      throw new UnauthorizedException();
    }

    request.token = token;
    return true;
  }
}
