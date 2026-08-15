export interface Config {
  port: number;
  nodeEnv: string;
  frontendUrl: string;

  database: {
    url: string;
  };

  jwt: {
    secret: string;
    expiration: string;
    refreshExpiration: string;
  };

  email: {
    user: string;
    password: string;
    host: string;
    port: number;
    secure: boolean;
  };

  otp: {
    expirationMinutes: number;
  };

  admin: {
    email: string;
  };

  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
    folder: string;
  };

  cookie: {
    secret: string;
  };

  cors: {
    allowedOrigins: string[];
  };
}
