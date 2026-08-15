import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<boolean>('SMTP_SECURE'),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendOtpEmail(to: string, otp: string) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #0F4C4C; }
            .header h1 { color: #0F4C4C; font-size: 28px; margin: 0; }
            .content { padding: 30px 20px; text-align: center; }
            .otp-code { font-size: 48px; font-weight: bold; color: #0F4C4C; background-color: #f0f7f7; padding: 20px; border-radius: 10px; display: inline-block; letter-spacing: 10px; margin: 20px 0; }
            .expiry { color: #666; font-size: 14px; margin-top: 20px; }
            .footer { text-align: center; padding: 20px 0; border-top: 1px solid #e0e0e0; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 ASCEND</h1>
              <p style="color: #666;">Admin Dashboard Login</p>
            </div>
            <div class="content">
              <h2>Your One-Time Password</h2>
              <p style="color: #666; margin-bottom: 10px;">Use the following OTP to login to your dashboard:</p>
              <div class="otp-code">${otp}</div>
              <p style="color: #666; margin-top: 10px;">This OTP will expire in 10 minutes.</p>
              <div class="expiry">
                <p>If you didn't request this OTP, please ignore this email.</p>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ASCEND. All rights reserved.</p>
              <p>Building Businesses. Scaling Brands.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
      ASCEND Admin Dashboard Login
      
      Your OTP code is: ${otp}
      
      This code will expire in 10 minutes.
      
      If you didn't request this OTP, please ignore this email.
      
      © ${new Date().getFullYear()} ASCEND. All rights reserved.
    `;

    await this.transporter.sendMail({
      from: `"ASCEND Admin" <${this.configService.get<string>('SMTP_USER')}>`,
      to,
      subject: '🔐 ASCEND Dashboard - Your OTP Code',
      text,
      html,
    });
  }
}
