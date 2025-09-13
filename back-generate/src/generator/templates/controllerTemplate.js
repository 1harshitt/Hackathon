export function generateController(modelName, fields) {
  const capitalizedModelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
  
  // Create validation schema based on fields
  const validationFields = fields.map(field => {
    let validation = `        ${field.name}: Joi.${field.type === 'STRING' || field.type === 'TEXT' ? 'string()' : 
      field.type === 'INTEGER' ? 'number().integer()' : 
      field.type === 'FLOAT' ? 'number()' : 
      field.type === 'BOOLEAN' ? 'boolean()' : 
      field.type === 'DATE' ? 'date()' : 
      field.type === 'ENUM' ? `string().valid(${field.values.map(v => `'${v}'`).join(', ')})` : 
      'string()'}`;
      
    if (field.required) {
      validation += '.required()';
    } else {
      validation += '.allow(\'\', null)';
    }
    
    return validation;
  }).join(',\n');

  return `import Joi from 'joi';
import ${capitalizedModelName} from '../models/${modelName}Model.js';
import createBaseController from '../controllers/conrollersUtils/baseController.js';
import { Op } from 'sequelize';

const validationSchemas = {
    create: Joi.object({
${validationFields}
    }),
    update: Joi.object({
${validationFields}
    })
};

const hooks = {
    beforeCreate: async (data) => {
        // Add any custom validation or data transformation here
        return data;
    },
    beforeUpdate: async (data, req, res) => {
        // Add any custom validation or data transformation here
        return data;
    },
};

const { validators, handlers, crud } = createBaseController(${capitalizedModelName}, validationSchemas, hooks);

export { validators, handlers, crud };`;
} 