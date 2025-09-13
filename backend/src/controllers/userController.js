import Joi from 'joi';
import User from '../models/UserModel.js';
import createBaseController from '../controllers/conrollersUtils/baseController.js';
import { Op } from 'sequelize';

const validationSchemas = {
    create: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().email().optional(),
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        role_id: Joi.string().optional(),
        isActive: Joi.boolean().optional()
    }),
    update: Joi.object({
        username: Joi.string().optional(),
        password: Joi.string().optional(),
        email: Joi.string().email().optional(),
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        role_id: Joi.string().optional(),
        isActive: Joi.boolean().optional(),
        lastLogin: Joi.date().optional()
    })
};

const hooks = {
    beforeCreate: async (data) => {
        // Check if username already exists
        const existingUser = await User.findOne({
            where: {
                username: {
                    [Op.eq]: data.username
                }
            }
        });

        if (existingUser) {
            throw new Error('Username already exists');
        }

        // In a real app, hash the password here
        // data.password = await bcrypt.hash(data.password, 10);

        return data;
    },
    beforeUpdate: async (data, req, res) => {
        // If username is being updated, check for uniqueness
        if (data.username) {
            const existingUser = await User.findOne({
                where: {
                    username: {
                        [Op.eq]: data.username
                    },
                    id: {
                        [Op.ne]: req.params.id
                    }
                }
            });

            if (existingUser) {
                throw new Error('Username already exists');
            }
        }

        // In a real app, hash the password if it's being updated
        // if (data.password) {
        //     data.password = await bcrypt.hash(data.password, 10);
        // }

        return data;
    },
};

const { validators, handlers, crud } = createBaseController(User, validationSchemas, hooks);

export { validators, handlers, crud };