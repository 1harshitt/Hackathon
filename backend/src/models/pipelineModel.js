import { DataTypes, sequelize, createBaseModel } from './modelUtils/modelUtils.js';

const pipelineAttributes = {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
};

const Pipeline = createBaseModel(sequelize, 'Pipeline', pipelineAttributes);

export default Pipeline;
