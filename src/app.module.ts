import { join } from 'path';
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import configuration from './config/enviroment.config';
import validationSchema from './config/enviroment-schema.config';
import { JwtMiddleware } from './common/middleware/jwt.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: validationSchema,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    RouterModule.register([
      {
        path: 'security',
        children: [
          {
            path: 'auth',
            module: AuthModule,
          },
        ],
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: parseInt(configService.get('database.port'), 10),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        // entities: [],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
      dataSourceFactory: async options => {
        const logger = new Logger('AppModuleDB');
        const dataSource = await new DataSource(options).initialize();
        if (dataSource.isInitialized) {
          logger.log(`Database is Online, connected to ${dataSource.options.database}`);
        }
        return dataSource;
      },
    }),
    CommonModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).exclude('security/auth/sign-in', 'security/auth/sign-up').forRoutes('*');
  }
}
