import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    // Create NestJS application
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'debug', 'log', 'verbose'],
    });

    // Get config service
    const configService = app.get(ConfigService);

    // Get environment variables
    const port = configService.get<number>('PORT', 5000);
    const nodeEnv = configService.get<string>('NODE_ENV', 'development');
    const frontendUrl = configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:5173',
    );
    const cookieSecret = configService.get<string>(
      'COOKIE_SECRET',
      'cookie-secret-key',
    );

    // ============ MIDDLEWARE ============

    // Cookie parser middleware
    app.use(cookieParser(cookieSecret));

    // ============ CORS CONFIGURATION ============

    const isProduction = nodeEnv === 'production';

    app.enableCors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
          callback(null, true);
          return;
        }

        // Allow frontend URL
        if (
          origin === frontendUrl ||
          origin === 'http://localhost:5173' ||
          origin === 'http://localhost:3000'
        ) {
          callback(null, true);
          return;
        }

        // In development, allow all localhost origins
        if (!isProduction && origin.includes('localhost')) {
          callback(null, true);
          return;
        }

        // In production, only allow specific origins
        if (isProduction) {
          const allowedOrigins = [
            frontendUrl,
            'https://your-production-domain.com',
          ];
          if (allowedOrigins.includes(origin as string)) {
            callback(null, true);
            return;
          }
        }

        callback(new Error('Not allowed by CORS'), false);
      },
      credentials: true, // Important for cookies
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept',
        'X-Requested-With',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
      ],
      exposedHeaders: ['Set-Cookie', 'Cookie'],
      maxAge: 86400, // 24 hours
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });

    // ============ GLOBAL PIPES ============

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Strip properties that are not in the DTO
        transform: true, // Automatically transform payloads to DTO instances
        forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
        transformOptions: {
          enableImplicitConversion: false, // Don't automatically convert types
        },
        validationError: {
          target: false,
          value: false,
        },
      }),
    );

    // ============ GLOBAL INTERCEPTORS ============

    // Global response transformation interceptor
    app.useGlobalInterceptors(new TransformInterceptor());

    // ============ GLOBAL FILTERS ============

    // Global exception filter
    app.useGlobalFilters(new HttpExceptionFilter());

    // ============ API PREFIX ============

    app.setGlobalPrefix('api', {
      exclude: ['/', '/health', '/healthz'], // Exclude health check endpoints
    });
    app.useGlobalGuards(new JwtAuthGuard(new Reflector()));

    // ============ START SERVER ============

    await app.listen(port);

    logger.log(`🚀 Server running on http://localhost:${port}`);
    logger.log(`📧 Admin email: ${configService.get('ADMIN_EMAIL')}`);
    logger.log(`☁️ Cloudinary: ${configService.get('CLOUDINARY_CLOUD_NAME')}`);
    logger.log(`🌍 Environment: ${nodeEnv}`);
    logger.log(`🔗 Frontend URL: ${frontendUrl}`);
    logger.log(`🍪 Cookie secure: ${isProduction}`);
    logger.log(`✅ CORS enabled for: ${frontendUrl}`);

    // Log all registered routes (for debugging)
    if (nodeEnv === 'development') {
      const server = app.getHttpServer();
      const router = server._events?.request?.router;
      if (router && Array.isArray(router.stack)) {
        const routes = router.stack
          .filter((layer: any): layer is any => !!layer.route)
          .map((layer: any) => {
            const methods = Object.keys(
              layer.route.methods as Record<string, boolean>,
            )
              .map((m: string) => m.toUpperCase())
              .join(', ');
            return `${methods} ${layer.route.path}`;
          });
        logger.debug('Registered routes:');
        routes.forEach((route: string) => logger.debug(`  ${route}`));
      }
    }

    // Handle graceful shutdown
    const signals = ['SIGTERM', 'SIGINT', 'SIGHUP'];
    signals.forEach((signal) => {
      process.on(signal, () => {
        logger.log(`Received ${signal}, shutting down gracefully...`);
        app
          .close()
          .then(() => {
            process.exit(0);
          })
          .catch(() => {
            process.exit(1);
          });
      });
    });
  } catch (error) {
    const logger = new Logger('Bootstrap');
    logger.error('Failed to start application:', (error as Error).stack);
    process.exit(1);
  }
}

// Handle unhandled rejections and exceptions
process.on('unhandledRejection', (reason, promise) => {
  const logger = new Logger('UnhandledRejection');
  logger.error('Unhandled Rejection at:', promise);
  logger.error('Reason:', (reason as Error).stack);
});

process.on('uncaughtException', (error) => {
  const logger = new Logger('UncaughtException');
  logger.error('Uncaught Exception:', error.stack);
  process.exit(1);
});

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Failed to start application:', (error as Error).stack);
  process.exit(1);
});
