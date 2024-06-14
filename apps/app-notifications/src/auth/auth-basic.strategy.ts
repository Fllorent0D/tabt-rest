import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      passReqToCallback: true,
    });
  }

  async validate(req, username, password): Promise<boolean> {
    const app = await this.authService.findOne(username, password);

    if (app) {
      return true;
    }
    throw new UnauthorizedException();
  }
}
