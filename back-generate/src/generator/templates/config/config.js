import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const PORT = process.env.PORT || '3000';
export const DB_NAME = process.env.DB_NAME || 'test_db';
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const TIMEZONE = process.env.TIMEZONE || '+00:00';
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
export const SMTP_HOST = process.env.SMTP_HOST || '';
export const SMTP_PORT = process.env.SMTP_PORT || '';
export const SMTP_USER = process.env.SMTP_USER || '';
export const SMTP_PASS = process.env.SMTP_PASS || '';

export const CONFIG = {
    username: process.env.USER_NAME || 'admin',
    password: process.env.PASSWORD || 'password',
    email: process.env.EMAIL || 'admin@example.com',
    phone: process.env.PHONE || '1234567890'
};

const config = {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  
  // Database configuration
  database: {
    name: process.env.DB_NAME || 'test_db',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.DB_LOGGING === 'true',
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  // API configuration
  api: {
    prefix: process.env.API_PREFIX || '/api'
  },
  
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: process.env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  }
};

export default config; 