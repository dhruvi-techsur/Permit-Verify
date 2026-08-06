import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendPasswordReset(to: string, name: string, resetLink: string): Promise<void> {
    // In development, log the link instead of sending email
    // TODO Phase 1: Wire to Nodemailer + Resend/SES for real email delivery
    this.logger.log(`[EMAIL] Password reset for ${name} <${to}>`);
    this.logger.log(`[EMAIL] Reset link: ${resetLink}`);
  }
}
