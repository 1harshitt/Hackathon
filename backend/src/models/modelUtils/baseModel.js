import { DataTypes } from 'sequelize';
import generateId from '../../middlewares/generatorId.js';

const createBaseModel = (sequelize, modelName, attributes = {}) => {
    const baseAttributes = {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            unique: true,
            defaultValue: () => generateId()
        },
        created_by: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        updated_by: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        ...attributes
    };

    const model = sequelize.define(modelName, baseAttributes);

    // Add hooks for ID generation
    model.beforeCreate(async (instance) => {
        let isUnique = false;
        let newId;
        while (!isUnique) {
            newId = generateId();
            const existingItem = await model.findOne({ where: { id: newId } });
            if (!existingItem) {
                isUnique = true;
            }
        }
        instance.id = newId;
    });

    return model;
};

export default createBaseModel; 