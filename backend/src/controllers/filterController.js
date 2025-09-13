import Joi from 'joi';
import { Op } from 'sequelize';
import Filter from '../models/filterModel.js';
import createBaseController from './conrollersUtils/baseController.js';

const validationSchemas = {
    create: Joi.object({
        name: Joi.string().required(),
        type: Joi.string().valid('category', 'source', 'tag', 'label', 'status').required()
    }),
    update: Joi.object({
        name: Joi.string(),
        type: Joi.string().valid('category', 'source', 'tag', 'label', 'status')
    })
};

const hooks = {
    beforeCreate: async (data) => {
        const exists = await Filter.findOne({
            where: {
                name: data.name,
                type: data.type
            }
        });
        if (exists) {
            throw new Error(`${data.type} with name "${data.name}" already exists`);
        }
        return data;
    },
    beforeUpdate: async (data, req) => {
        if (data.name || data.type) {
            const filter = await Filter.findByPk(req.params.id);
            if (!filter) {
                throw new Error('Filter not found');
            }

            const exists = await Filter.findOne({
                where: {
                    name: data.name || filter.name,
                    type: data.type || filter.type,
                    id: { [Op.ne]: req.params.id }
                }
            });
            if (exists) {
                throw new Error(`${data.type || filter.type} with name "${data.name || filter.name}" already exists`);
            }
        }
        return data;
    },
    beforeFind: async (query, req) => {
        // Add type filter if provided in query
        if (req?.query?.type) {
            query = {
                ...query,
                type: req.query.type
            };
        }
        return query;
    }
};

const { validators, handlers, crud } = createBaseController(Filter, validationSchemas, hooks);

export { validators, handlers, crud }; 