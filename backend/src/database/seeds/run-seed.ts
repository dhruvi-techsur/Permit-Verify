import { DataSource } from 'typeorm';
import { runSeed } from './seed';

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  migrations: ['src/database/migrations/*.ts'],
});

dataSource.initialize().then(async (ds) => {
  await runSeed(ds);
  await ds.destroy();
});
