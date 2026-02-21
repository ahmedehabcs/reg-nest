import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    jwt: {
        secret: process.env.JWT_SECRET || 'defaultSecret',
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
    databaseUrl: process.env.DATABASE_URL,
}));