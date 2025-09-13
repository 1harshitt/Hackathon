import { DataTypes, sequelize, createBaseModel } from './modelUtils/modelUtils.js';

const filterAttributes = {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('category', 'source', 'tag', 'label', 'status'),
        allowNull: false
    }
};

// Add unique constraint for name + type combination
const modelOptions = {
    indexes: [
        {
            unique: true,
            fields: ['name', 'type']
        }
    ]
};

const Filter = createBaseModel(sequelize, 'Filter', filterAttributes, modelOptions);

export default Filter; 