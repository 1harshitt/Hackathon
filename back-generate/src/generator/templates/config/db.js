import { Sequelize } from 'sequelize';
import { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, TIMEZONE } from './config.js';

// Create Sequelize instance
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    timezone: TIMEZONE || '+00:00',
    dialectOptions: {
        timezone: TIMEZONE || '+00:00',
    },
    logging: false
});

// Test the connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully!');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    }
})();

export default sequelize; 