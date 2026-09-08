import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from '../users/entities/refresh-token.entity';
import { PasswordResetToken } from '../users/entities/password-reset-token.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, RefreshToken, PasswordResetToken],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});

export default AppDataSource;
