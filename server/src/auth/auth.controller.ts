import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import type { Request as ExpressRequest, Response } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { User } from '../common/decorators/user.decorator';
import { AuthService } from './auth.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('request-otp')
  async requestOtp(@Body() dto: RequestOtpDto) {
    return this.authService.requestOtp(dto);
  }

  @Public()
  @Post('verify-otp')
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.verifyOtp(dto, response);
  }

  @Public()
  @Post('refresh')
  refreshToken(
    @Req() request: ExpressRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.refreshToken(request, response);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }

  @Get('me')
  getMe(@User() user: any) {
    return this.authService.getMe(user);
  }
}
