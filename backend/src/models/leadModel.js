import { DataTypes, sequelize, createBaseModel } from './modelUtils/modelUtils.js';

const leadAttributes = {
    leadTitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    leadValue: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    pipeline: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    stage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    source: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        allowNull: true,
        defaultValue: 'medium',
    },
    status: {
        type: DataTypes.ENUM('open', 'closed'),
        allowNull: true,
        defaultValue: 'open',
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contact: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    is_converted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
};

const Lead = createBaseModel(sequelize, 'Lead', leadAttributes);

export default Lead;
