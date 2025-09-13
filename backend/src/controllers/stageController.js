import Joi from 'joi';
import { Op } from 'sequelize';
import Stage from '../models/stageModel.js';
import createBaseController from './conrollersUtils/baseController.js';
import Pipeline from '../models/pipelineModel.js';

const validationSchemas = {
    create: Joi.object({
        name: Joi.string().required(),
        pipeline: Joi.string().required(),
        type: Joi.string().required(),
        is_default: Joi.boolean()
    }),
    update: Joi.object({
        name: Joi.string(),
        pipeline: Joi.string(),
        order: Joi.number().min(0),
        type: Joi.string(),
        is_default: Joi.boolean()
    })
};

const hooks = {
    beforeCreate: async (data) => {
        const pipeline = await Pipeline.findByPk(data.pipeline);
        if (!pipeline) {
            throw new Error('Pipeline not found');
        }

        const isStageExists = await Stage.findOne({
            where: { name: data.name, pipeline: data.pipeline }
        });
        if (isStageExists) {
            throw new Error('Stage already exists');
        }

        // Check if there's already a default stage for this pipeline and type
        if (data.is_default) {
            const existingDefault = await Stage.findOne({
                where: {
                    pipeline: data.pipeline,
                    type: data.type,
                    is_default: true
                }
            });
            if (existingDefault) {
                throw new Error('Default stage already exists');
            }
        }

        const stages = await Stage.findAll({
            where: {
                pipeline: data.pipeline,
                type: data.type
            },
            order: [['order', 'ASC']]
        });

        data.order = stages.length;

        return data;
    },
    beforeUpdate: async (data, req) => {
        const stage = await Stage.findByPk(req.params.id);
        if (!stage) throw new Error('Stage not found');

        // Handle default stage logic
        if (data.is_default !== undefined) {
            // If trying to set as default, check if another default exists
            if (data.is_default === true) {
                const existingDefault = await Stage.findOne({
                    where: {
                        pipeline: data.pipeline || stage.pipeline,
                        type: data.type || stage.type,
                        is_default: true,
                        id: { [Op.ne]: req.params.id }
                    }
                });
                if (existingDefault) {
                    throw new Error('Default stage already exists');
                }
            }
        }

        if (!data.order && data.order !== 0) {
            // If only updating is_default or other fields, return early
            if (!data.pipeline && !data.type) {
                return data;
            }
        }

        const stages = await Stage.findAll({
            where: {
                pipeline: data.pipeline || stage.pipeline,
                type: data.type || stage.type,
                id: { [Op.ne]: req.params.id }
            },
            order: [['order', 'ASC']]
        });

        if (data.order > stages.length) {
            data.order = stages.length;
        }

        const oldOrder = stage.order;
        const newOrder = data.order;

        if (newOrder !== oldOrder) {
            if (newOrder < oldOrder) {
                for (const s of stages) {
                    if (s.order >= newOrder && s.order < oldOrder) {
                        await s.update({ order: s.order + 1 });
                    }
                }
            }
            else if (newOrder > oldOrder) {
                for (const s of stages) {
                    if (s.order <= newOrder && s.order > oldOrder) {
                        await s.update({ order: s.order - 1 });
                    }
                }
            }
        }

        if (data.pipeline || data.type) {
            if (data.pipeline) {
                const pipeline = await Pipeline.findByPk(data.pipeline);
                if (!pipeline) throw new Error('Pipeline not found');
            }

            const isStageExists = await Stage.findOne({
                where: {
                    name: data.name || stage.name,
                    pipeline: data.pipeline || stage.pipeline,
                    type: data.type || stage.type,
                    id: { [Op.ne]: req.params.id }
                }
            });
            if (isStageExists) throw new Error('Stage already exists');

            if (data.type && data.type !== stage.type) {
                const newTypeStages = await Stage.findAll({
                    where: {
                        pipeline: data.pipeline || stage.pipeline,
                        type: data.type
                    }
                });
                data.order = newTypeStages.length;
            }
        }

        return data;
    },
    afterDelete: async (stage) => {
        const stages = await Stage.findAll({
            where: {
                pipeline: stage.pipeline,
                type: stage.type,
                order: { [Op.gt]: stage.order }
            },
            order: [['order', 'ASC']]
        });

        for (const s of stages) {
            await s.update({ order: s.order - 1 });
        }
    }
};

const { validators, handlers, crud } = createBaseController(Stage, validationSchemas, hooks);

export { validators, handlers, crud };
