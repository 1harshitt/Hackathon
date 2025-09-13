import Joi from 'joi';
import Lead from '../models/leadModel.js';
import createBaseController from './conrollersUtils/baseController.js';

const validationSchemas = {
    create: Joi.object({
        leadTitle: Joi.string().required(),
        leadValue: Joi.number().required(),
        pipeline: Joi.string().required(),
        stage: Joi.string().required(),
        source: Joi.string().required(),
        category: Joi.string().required(),
        contact: Joi.string()
    }),
    update: Joi.object({
        leadTitle: Joi.string(),
        leadValue: Joi.number(),
        pipeline: Joi.string(),
        stage: Joi.string(),
        source: Joi.string(),
        category: Joi.string(),
        priority: Joi.string(),
        status: Joi.string(),
        is_converted: Joi.boolean(),
        contact: Joi.string().optional().allow(null)
    })
};

const hooks = {
    beforeCreate: async (data) => data,
    beforeUpdate: async (data) => data,
    beforeFind: (query) => query
};

const { validators, handlers, crud } = createBaseController(Lead, validationSchemas, hooks);

export { validators, handlers, crud };