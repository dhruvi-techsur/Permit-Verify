import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

/**
 * Context boot test — boots the full NestJS application context against a real database.
 * Catches: route collisions, DI failures, ORM schema mismatches.
 * Must stay green through all phases.
 */
describe('AppModule (context boot)', () => {
  let app: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  }, 30000);

  afterAll(async () => {
    await app?.close();
  });

  it('application context initializes without errors', () => {
    expect(app).toBeDefined();
  });
});
