import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User, UserRole } from '../users/entities/user.entity';
import { RefreshToken } from '../users/entities/refresh-token.entity';
import { PasswordResetToken } from '../users/entities/password-reset-token.entity';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { jwtConfig } from '../config/jwt.config';

const BCRYPT_COST = 12; // From TechArch Security spec

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(RefreshToken) private refreshTokenRepo: Repository<RefreshToken>,
    @InjectRepository(PasswordResetToken) private prtRepo: Repository<PasswordResetToken>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  private sha256(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  private async issueTokenPair(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.id, email: user.email, role: user.role };

    // Access token: 15min expiry (from TechArch)
    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConfig.accessSecret,
      expiresIn: jwtConfig.accessExpiresIn,
    });

    // Refresh token: 7d expiry, stored as SHA-256 hash (from TechArch §5.1)
    const rawRefreshToken = crypto.randomBytes(64).toString('hex');
    const tokenHash = this.sha256(rawRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.refreshTokenRepo.save({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    return { accessToken, refreshToken: rawRefreshToken };
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('An account with this email already exists');

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_COST);
    const user = this.usersRepo.create({
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      role: UserRole.APPLICANT, // Default role for self-registration (AUTH-01)
    });
    await this.usersRepo.save(user);

    const tokens = await this.issueTokenPair(user);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({ where: { email: dto.email, isActive: true } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.issueTokenPair(user);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async refresh(rawRefreshToken: string) {
    const tokenHash = this.sha256(rawRefreshToken);
    const record = await this.refreshTokenRepo.findOne({
      where: { tokenHash },
      relations: ['user'],
    });

    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token invalid or expired');
    }

    // Revoke old refresh token (sliding window rotation)
    await this.refreshTokenRepo.delete({ id: record.id });

    const tokens = await this.issueTokenPair(record.user);
    return tokens;
  }

  async logout(rawRefreshToken: string): Promise<{ message: string }> {
    const tokenHash = this.sha256(rawRefreshToken);
    await this.refreshTokenRepo.delete({ tokenHash });
    return { message: 'Logged out successfully.' };
  }

  async forgotPassword(email: string): Promise<void> {
    // Always return 200 to prevent email enumeration (from TechArch Security spec)
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) return;

    // Generate secure random token, store SHA-256 hash (from TechArch §7.3)
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.sha256(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour (from TechArch)

    await this.prtRepo.save({ userId: user.id, tokenHash, expiresAt });

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${rawToken}`;
    await this.emailService.sendPasswordReset(user.email, user.fullName, resetLink);
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const tokenHash = this.sha256(dto.token);
    const record = await this.prtRepo.findOne({
      where: { tokenHash },
      relations: ['user'],
    });

    if (!record || record.expiresAt < new Date() || record.usedAt) {
      throw new BadRequestException('This link has expired or already been used');
    }

    // Update password with bcrypt cost 12 (from TechArch Security spec)
    const passwordHash = await bcrypt.hash(dto.newPassword, BCRYPT_COST);
    await this.usersRepo.update(record.userId, { passwordHash });

    // Mark token as used — single-use (from TechArch Security spec)
    await this.prtRepo.update(record.id, { usedAt: new Date() });

    // Invalidate all existing refresh tokens for this user (from TechArch §7.3 step 9)
    await this.refreshTokenRepo.delete({ userId: record.userId });

    return { message: 'Password updated successfully.' };
  }

  sanitizeUser(user: User) {
    const { passwordHash: _, ...safe } = user as any;
    return safe;
  }
}
