import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

const BCRYPT_COST = 12;

const SEED_USERS = [
  {
    email: 'applicant@permitflow.test',
    full_name: 'Alex Applicant',
    role: 'applicant',
    password: 'Test1234!',
  },
  {
    email: 'reviewer@permitflow.test',
    full_name: 'Riley Reviewer',
    role: 'reviewer',
    password: 'Test1234!',
  },
  {
    email: 'admin@permitflow.test',
    full_name: 'Sam Admin',
    role: 'admin',
    password: 'Test1234!',
  },
];

export async function runSeed(dataSource: DataSource): Promise<void> {
  for (const user of SEED_USERS) {
    const passwordHash = await bcrypt.hash(user.password, BCRYPT_COST);
    await dataSource.query(
      `
      INSERT INTO users (email, password_hash, full_name, role)
      VALUES ($1, $2, $3, $4::user_role)
      ON CONFLICT (email) DO UPDATE
        SET full_name = EXCLUDED.full_name,
            role = EXCLUDED.role,
            updated_at = NOW()
      `,
      [user.email, passwordHash, user.full_name, user.role],
    );
  }
  console.log('Seed complete: 3 users created (applicant, reviewer, admin)');
}
