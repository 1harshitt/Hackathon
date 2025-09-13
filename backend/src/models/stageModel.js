import { DataTypes, sequelize, createBaseModel } from './modelUtils/modelUtils.js';

const stageAttributes = {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pipeline: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    }
};


const Stage = createBaseModel(sequelize, 'Stage', stageAttributes);

export default Stage;
