import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;
export const DB_NAME = process.env.DB_NAME;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_HOST = process.env.DB_HOST;
export const TIMEZONE = process.env.TIMEZONE;
export const JWT_SECRET = process.env.JWT_SECRET;
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = process.env.SMTP_PORT;
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;

export const CONFIG = {
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
    email: process.env.EMAIL,
    phone: process.env.PHONE
};



