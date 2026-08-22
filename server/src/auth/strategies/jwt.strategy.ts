import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = request?.cookies?.['access_token'];
          if (token) {
            this.logger.debug('Token found in cookies');
          } else {
            this.logger.debug('No token found in cookies');
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  validate(payload: any) {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');

    // Validate that the token belongs to the admin
    if (payload.email.toLowerCase() !== adminEmail || !payload.isAdmin) {
      this.logger.warn('Invalid token payload:', {
        email: payload.email,
        isAdmin: payload.isAdmin,
        expectedEmail: adminEmail,
      });
      throw new UnauthorizedException('Invalid token');
    }

    return {
      email: payload.email,
      role: 'admin',
      isAdmin: true,
    };
  }
}
