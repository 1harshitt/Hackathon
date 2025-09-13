import Joi from 'joi';
import Role from '../models/roleModel.js';
import createBaseController from './conrollersUtils/baseController.js';

const validationSchemas = {
    create: Joi.object({
        role_name: Joi.string().required(),
        permissions: Joi.object().optional().allow('', null)
    }),
    update: Joi.object({
        role_name: Joi.string(),
        permissions: Joi.object().optional().allow('', null)
    })
};

const hooks = {
    beforeCreate: async (data) => {
        // Map role_name to name
        return {
            ...data,
            name: data.role_name
        };
    },
    beforeUpdate: async (data) => {
        // Map role_name to name if it exists
        if (data.role_name) {
            data.name = data.role_name;
        }
        return data;
    },
    beforeFind: (query) => query
};

const { validators, handlers, crud } = createBaseController(Role, validationSchemas, hooks);

export { validators, handlers, crud };
