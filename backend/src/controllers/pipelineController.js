import Joi from 'joi';
import Pipeline from '../models/pipelineModel.js';
import createBaseController from './conrollersUtils/baseController.js';

const validationSchemas = {
    create: Joi.object({
        name: Joi.string().required()
    }),
    update: Joi.object({
        name: Joi.string()
    })
};

const hooks = {
    beforeCreate: async (data) => data,
    beforeUpdate: async (data) => data,
    beforeFind: (query) => query
};

const { validators, handlers, crud } = createBaseController(Pipeline, validationSchemas, hooks);

export { validators, handlers, crud };
