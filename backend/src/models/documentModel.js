import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import createBaseModel from './modelUtils/baseModel.js';

const documentAttributes = {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file_path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file_size: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    uploaded_by: {
        type: DataTypes.STRING,
        allowNull: false
    }
};

const Document = createBaseModel(sequelize, 'document', documentAttributes);

export default Document;