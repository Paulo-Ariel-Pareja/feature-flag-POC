import { registerAs } from '@nestjs/config';

export default registerAs('redisConfig', () => ({
  host: process.env.REDIS_HOSTNAME || '127.0.0.1',
  port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 7001,
  password: process.env.REDIS_PRIMARY_ACCESS_KEY || '',
  db: process.env.NODE_REDIS_DB_NUMBER || 13,
  tls: process.env.REDIS_USE_TLS || false
}));