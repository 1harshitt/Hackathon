import { DataTypes, sequelize, createBaseModel } from './modelUtils/modelUtils.js';

const apiGeneratorAttributes = {
    module_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    fields: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    requirements: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {
            authentication: true,
            openRoutes: [],
            relations: []
        }
    },
    status: {
        type: DataTypes.ENUM('pending', 'generated', 'failed'),
        allowNull: false,
        defaultValue: 'pending'
    },
    generated_files: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    error_message: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    }
};

const ApiGenerator = createBaseModel(sequelize, 'ApiGenerator', apiGeneratorAttributes);

export default ApiGenerator;