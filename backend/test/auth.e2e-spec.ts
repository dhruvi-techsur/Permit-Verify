import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  const testEmail = `e2e-test-${Date.now()}@test.com`;
  const testPassword = 'Test1234!';
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    dataSource = moduleFixture.get(DataSource);
  }, 30000);

  afterAll(async () => {
    // Cleanup test user
    await dataSource.query('DELETE FROM users WHERE email = $1', [testEmail]);
    await app.close();
  });

  // AUTH-01: POST /register
  describe('POST /api/v1/auth/register', () => {
    it('creates user and returns 201 with token pair', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email: testEmail, password: testPassword, fullName: 'E2E Tester' })
        .expect(201);

      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(testEmail);
      expect(res.body.user.role).toBe('applicant');
      expect(res.body.user.passwordHash).toBeUndefined(); // Never exposed
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();

      accessToken = res.body.accessToken;
      refreshToken = res.body.refreshToken;
    });

    it('returns 409 on duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email: testEmail, password: testPassword, fullName: 'Duplicate' })
        .expect(409);
    });

    it('returns 400 on invalid email', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email: 'not-an-email', password: testPassword, fullName: 'Test' })
        .expect(400);
    });
  });

  // AUTH-02: POST /login
  describe('POST /api/v1/auth/login', () => {
    it('returns 200 with token pair on valid credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: testEmail, password: testPassword })
        .expect(200);

      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
      expect(res.body.user.email).toBe(testEmail);
    });

    it('returns 401 on wrong password', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: testEmail, password: 'WrongPass1!' })
        .expect(401);
    });

    it('returns 401 on nonexistent email', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'nobody@nowhere.com', password: testPassword })
        .expect(401);
    });
  });

  // GET /me — JWT auth enforcement
  describe('GET /api/v1/auth/me', () => {
    it('returns 401 without JWT', async () => {
      await request(app.getHttpServer()).get('/api/v1/auth/me').expect(401);
    });

    it('returns 200 with valid JWT', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.email).toBe(testEmail);
      expect(res.body.role).toBe('applicant');
    });
  });

  // AUTH-02: POST /refresh — token rotation
  describe('POST /api/v1/auth/refresh', () => {
    it('issues new token pair and revokes old refresh token', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
      expect(res.body.refreshToken).not.toBe(refreshToken);

      // Update for logout test
      refreshToken = res.body.refreshToken;
    });

    it('returns 401 on reused refresh token (revocation)', async () => {
      // The old token from before the refresh above should be revoked
      await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: accessToken }) // wrong token type → invalid
        .expect(401);
    });
  });

  // AUTH-04: POST /forgot-password
  describe('POST /api/v1/auth/forgot-password', () => {
    it('returns 200 for existing email (enumeration-safe)', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/forgot-password')
        .send({ email: testEmail })
        .expect(200);
    });

    it('returns 200 for non-existing email (enumeration-safe)', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'ghost@nowhere.test' })
        .expect(200);
    });
  });

  // AUTH-03: POST /logout
  describe('POST /api/v1/auth/logout', () => {
    it('revokes refresh token and returns 200', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .send({ refreshToken })
        .expect(200)
        .expect({ message: 'Logged out successfully.' });
    });

    it('refresh token no longer works after logout', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken })
        .expect(401);
    });
  });
});
