import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import createBaseModel from './modelUtils/baseModel.js';

const authAttributes = {
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
};

const Auth = createBaseModel(sequelize, 'auth', authAttributes);

export default Auth;