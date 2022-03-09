import { config } from 'dotenv';
config();

console.log(process.env.DATABASE_URL);

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN, APP_NAME, DATABASE_URL } = process.env;
