import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({

    port: Number(process.env.APP_PORT) || 3000,
    country: process.env.CONTEXT_COUNTRY || 'cl',
}));
