import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { EmailService } from '../email/email.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async requestOtp(dto: RequestOtpDto) {
    const { email } = dto;

    // Check if email matches the admin email from .env
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    if (email.toLowerCase() !== adminEmail) {
      throw new UnauthorizedException('Invalid email address');
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(
      expiresAt.getMinutes() +
        this.configService.get<number>('OTP_EXPIRATION_MINUTES', 10),
    );

    // Delete any existing OTP for this email
    await this.prisma.verification.deleteMany({
      where: { email },
    });

    // Store OTP in database
    await this.prisma.verification.create({
      data: {
        email,
        otp,
        expiresAt,
      },
    });

    // Try to send email, but don't fail if it doesn't work
    try {
      await this.emailService.sendOtpEmail(email, otp);
    } catch {
      this.logger.warn(
        'Failed to send OTP email, but continuing for development',
      );
      this.logger.log(`Development OTP for ${email}: ${otp}`);
    }

    return {
      message: 'OTP sent to your email',
      email: email,
      expiresIn: this.configService.get<number>('OTP_EXPIRATION_MINUTES', 10),
      devOtp: process.env.NODE_ENV === 'development' ? otp : undefined,
    };
  }

  async verifyOtp(dto: VerifyOtpDto, response: Response) {
    const { email, otp } = dto;

    // Find the OTP record
    const otpRecord = await this.prisma.verification.findFirst({
      where: {
        email,
        otp,
        verified: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid OTP');
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      throw new BadRequestException('OTP has expired');
    }

    // Mark OTP as verified
    await this.prisma.verification.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    // Clean up any other expired OTPs for this email
    await this.prisma.verification.deleteMany({
      where: {
        email,
        verified: false,
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    // Generate tokens
    const payload = {
      email: email,
      role: 'admin',
      isAdmin: true,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRATION', '7d'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '30d'),
    });

    // Set cookies with proper options
    const isProduction = this.configService.get('NODE_ENV') === 'production';

    // Set access token cookie
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Set refresh token cookie
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    this.logger.log(`User ${email} logged in successfully`);

    // Return user data (without tokens in body)
    return {
      user: {
        email: email,
        role: 'admin',
        name: 'Admin',
      },
      message: 'Login successful',
    };
  }

  logout(response: Response) {
    const isProduction = this.configService.get('NODE_ENV') === 'production';

    // Clear cookies
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    });
    response.clearCookie('refresh_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    });

    this.logger.log('User logged out successfully');

    return { message: 'Logged out successfully' };
  }

  refreshToken(request: any, response: Response) {
    try {
      // Get refresh token from cookies
      const refreshToken = request.cookies['refresh_token'] as string;

      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token not found');
      }

      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken);

      // Generate new access token
      const newAccessToken = this.jwtService.sign(
        {
          email: payload.email,
          role: 'admin',
          isAdmin: true,
        },
        {
          expiresIn: this.configService.get('JWT_EXPIRATION', '7d'),
        },
      );

      // Set new access token cookie
      const isProduction = this.configService.get('NODE_ENV') === 'production';
      response.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      this.logger.log('Token refreshed successfully');

      return { message: 'Token refreshed successfully' };
    } catch (error) {
      this.logger.error('Refresh token error:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  getMe(user: any) {
    return {
      email: user.email,
      role: 'admin',
      name: 'Admin',
    };
  }
}
