export default () => ({
  // App
  port: parseInt(process.env.PORT as string, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Database
  database: {
    url: process.env.DATABASE_URL,
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION || '7d',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '30d',
  },

  // Email
  email: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT as string, 10) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
  },

  // OTP
  otp: {
    expirationMinutes:
      parseInt(process.env.OTP_EXPIRATION_MINUTES as string, 10) || 10,
  },

  // Admin
  admin: {
    email: process.env.ADMIN_EMAIL,
  },

  // Cloudinary
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    folder: process.env.CLOUDINARY_FOLDER || 'ascend-website',
  },

  // Cookie
  cookie: {
    secret: process.env.COOKIE_SECRET || 'cookie-secret-key',
  },

  // CORS
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:5173', 'http://localhost:3000'],
  },
});
