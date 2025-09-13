import { DataTypes } from 'sequelize';
import sequelize from './config/db.js';
import createBaseModel from './modelUtils/baseModel.js';

export function generateModel(modelName, fields) {
  const capitalizedModelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);

  const fieldDefinitions = fields.map(field => {
    let fieldDef = `    ${field.name}: {
        type: DataTypes.${field.type}`;
    
    if (field.type === 'ENUM' && field.values) {
        fieldDef += `,
        values: [${field.values.map(v => `'${v}'`).join(', ')}]`;
    }
    
    if (field.required) {
        fieldDef += `,
        allowNull: false`;
    } else {
        fieldDef += `,
        allowNull: true,
        defaultValue: null`;
    }
    
    fieldDef += `
    }`;
    
    return fieldDef;
  }).join(',\n');

  return `import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import createBaseModel from './modelUtils/baseModel.js';

const ${modelName}Attributes = {
${fieldDefinitions}
};

const ${capitalizedModelName} = createBaseModel(sequelize, '${modelName.toLowerCase()}', ${modelName}Attributes);

export default ${capitalizedModelName};`;
} 