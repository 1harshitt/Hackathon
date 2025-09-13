export function generateUserModel() {
  return `import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import createBaseModel from './modelUtils/baseModel.js';

const userAttributes = {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    lastLogin: {
        type: DataTypes.DATE,
        allowNull: true
    }
};

const User = createBaseModel(sequelize, 'user', userAttributes);

export default User;`;
} 