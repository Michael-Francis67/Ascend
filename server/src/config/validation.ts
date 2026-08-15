import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // App
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
  PORT: Joi.number().default(3000),
  FRONTEND_URL: Joi.string().uri().default('http://localhost:5173'),

  // Database
  DATABASE_URL: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().min(32).required().messages({
    'string.min': 'JWT_SECRET must be at least 32 characters long',
    'any.required': 'JWT_SECRET is required',
  }),
  JWT_EXPIRATION: Joi.string().default('7d'),
  JWT_REFRESH_EXPIRATION: Joi.string().default('30d'),

  // Email
  SMTP_USER: Joi.string().email().required(),
  SMTP_PASS: Joi.string().required(),
  SMTP_HOST: Joi.string().default('smtp.gmail.com'),
  SMTP_PORT: Joi.number().default(587),
  SMTP_SECURE: Joi.boolean().default(false),

  // OTP
  OTP_EXPIRATION_MINUTES: Joi.number().default(10),

  // Admin
  ADMIN_EMAIL: Joi.string().email().required(),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
  CLOUDINARY_FOLDER: Joi.string().default('ascend-website'),

  // Cookie
  COOKIE_SECRET: Joi.string().default('cookie-secret-key'),

  // CORS
  ALLOWED_ORIGINS: Joi.string().optional(),
});
