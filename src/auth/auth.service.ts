import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './dto/payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async validateUser({ email, password }: AuthDto) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }

    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      name: user.name,
      is_admin: user.is_admin,
    };

    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: parseInt(process.env.JWT_EXPIRES_IN),
    };
  }
}
