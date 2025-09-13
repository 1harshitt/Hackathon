export function generateRoleModel() {
  return `import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import createBaseModel from './modelUtils/baseModel.js';

const roleAttributes = {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    permissions: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
};

const Role = createBaseModel(sequelize, 'role', roleAttributes);

export default Role;`;
} 