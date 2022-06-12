import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import fs from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [process.env.POSTGRES_ENTITIES],
  synchronize: process.env.POSTGRES_SYNCHRONIZE === 'true',
  logging: process.env.POSTGRES_LOGGING === 'true',
  migrations: [process.env.POSTGRES_MIGRATIONS],
  migrationsTableName: process.env.POSTGRES_MIGRATIONS_TABLE_NAME,
  migrationsRun: process.env.POSTGRES_MIGRATIONS_RUN === 'true',
  ssl:
    process.env.NODE_ENV === 'development'
      ? false
      : {
          rejectUnauthorized: true,
          ca: fs
            .readFileSync(join(process.cwd(), 'certs/ca-certificate.crt'))
            .toString(),
        },
  cli: {
    migrationsDir: './src/migrations',
  },
};

export default ormConfig;
