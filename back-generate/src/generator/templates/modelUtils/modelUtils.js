import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import createBaseModel from './baseModel.js';
import { initializeDefaultData } from './defaultData.js';

// Initialize default data after database sync
sequelize.sync().then(() => {
    initializeDefaultData();
});

export {
    DataTypes,
    sequelize,
    createBaseModel,
    initializeDefaultData
}; 