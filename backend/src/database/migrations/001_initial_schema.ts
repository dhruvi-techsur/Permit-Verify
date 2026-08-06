import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1721000000001 implements MigrationInterface {
  name = 'InitialSchema1721000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enums
    await queryRunner.query(`
      CREATE TYPE user_role AS ENUM ('applicant', 'reviewer', 'admin')
    `);
    await queryRunner.query(`
      CREATE TYPE permit_status AS ENUM ('draft', 'submitted', 'under_review', 'additional_info_needed', 'approved', 'rejected')
    `);
    await queryRunner.query(`
      CREATE TYPE document_status AS ENUM ('pending', 'uploaded', 'deleted')
    `);
    await queryRunner.query(`
      CREATE TYPE notification_type AS ENUM ('status_changed', 'message_received', 'info_requested', 'approved', 'rejected')
    `);

    // users table (EXACT DDL from TechArch)
    await queryRunner.query(`
      CREATE TABLE users (
        id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
        email           TEXT            NOT NULL UNIQUE,
        password_hash   TEXT            NOT NULL,
        full_name       TEXT            NOT NULL,
        role            user_role       NOT NULL DEFAULT 'applicant',
        is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
        created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
        updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_users_email     ON users (email)`);
    await queryRunner.query(`CREATE INDEX idx_users_role      ON users (role)`);
    await queryRunner.query(`CREATE INDEX idx_users_is_active ON users (is_active)`);

    // password_reset_tokens table (EXACT DDL from TechArch)
    await queryRunner.query(`
      CREATE TABLE password_reset_tokens (
        id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash  TEXT        NOT NULL UNIQUE,
        expires_at  TIMESTAMPTZ NOT NULL,
        used_at     TIMESTAMPTZ,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_prt_user    ON password_reset_tokens (user_id)`);
    await queryRunner.query(`CREATE INDEX idx_prt_token   ON password_reset_tokens (token_hash)`);
    await queryRunner.query(`CREATE INDEX idx_prt_expires ON password_reset_tokens (expires_at)`);

    // refresh_tokens table (EXACT DDL from TechArch)
    await queryRunner.query(`
      CREATE TABLE refresh_tokens (
        id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash  TEXT        NOT NULL UNIQUE,
        expires_at  TIMESTAMPTZ NOT NULL,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_rt_user    ON refresh_tokens (user_id)`);
    await queryRunner.query(`CREATE INDEX idx_rt_token   ON refresh_tokens (token_hash)`);
    await queryRunner.query(`CREATE INDEX idx_rt_expires ON refresh_tokens (expires_at)`);

    // Auto-update trigger (EXACT from TechArch)
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION trigger_set_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
      $$ LANGUAGE plpgsql
    `);
    await queryRunner.query(`
      CREATE TRIGGER set_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_updated_at ON users`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS trigger_set_updated_at`);
    await queryRunner.query(`DROP TABLE IF EXISTS refresh_tokens`);
    await queryRunner.query(`DROP TABLE IF EXISTS password_reset_tokens`);
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
    await queryRunner.query(`DROP TYPE IF EXISTS notification_type`);
    await queryRunner.query(`DROP TYPE IF EXISTS document_status`);
    await queryRunner.query(`DROP TYPE IF EXISTS permit_status`);
    await queryRunner.query(`DROP TYPE IF EXISTS user_role`);
  }
}
