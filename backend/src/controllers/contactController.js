import Joi from 'joi';
import { Op } from 'sequelize';
import Contact from '../models/contactModel.js';
import createBaseController from './conrollersUtils/baseController.js';

const validationSchemas = {
    create: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.number().required()
    }),
    update: Joi.object({
        name: Joi.string(),
        email: Joi.string().email(),
        phone: Joi.number()
    })
};

const hooks = {
    beforeCreate: async (data) => {
        const emailExists = await Contact.findOne({ where: { email: data.email } });
        if (emailExists) throw new Error('Contact with this email already exists');

        const phoneExists = await Contact.findOne({ where: { phone: data.phone } });
        if (phoneExists) throw new Error('Contact with this phone number already exists');

        return data;
    },
    beforeUpdate: async (data) => {
        if (data.email) {
            const emailExists = await Contact.findOne({
                where: { email: data.email, id: { [Op.ne]: data.id } }
            });
            if (emailExists) throw new Error('Contact with this email already exists');
        }

        if (data.phone) {
            const phoneExists = await Contact.findOne({
                where: { phone: data.phone, id: { [Op.ne]: data.id } }
            });
            if (phoneExists) throw new Error('Contact with this phone number already exists');
        }

        return data;
    }
};

const { validators, handlers, crud } = createBaseController(Contact, validationSchemas, hooks);

// Export both standard and custom handlers
export { validators, handlers, crud };
