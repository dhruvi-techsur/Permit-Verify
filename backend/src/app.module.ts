import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { User } from './users/entities/user.entity';
import { RefreshToken } from './users/entities/refresh-token.entity';
import { PasswordResetToken } from './users/entities/password-reset-token.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, RefreshToken, PasswordResetToken],
      migrations: ['dist/database/migrations/*.js'],
      migrationsRun: false,
      synchronize: false,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'auth',
        ttl: Number(process.env.THROTTLE_AUTH_TTL) || 60000,
        limit: Number(process.env.THROTTLE_AUTH_LIMIT) || 5,
      },
    ]),
    AuthModule,
    UsersModule,
    EmailModule,
  ],
})
export class AppModule {}
