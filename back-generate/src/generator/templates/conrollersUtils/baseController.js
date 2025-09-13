import Joi from 'joi';
import responseHandler from '../utils/responseHandler.js';
import validator from '../utils/validator.js';

const createBaseController = (Model, validationSchemas = {}, hooks = {}) => {
    // Default validation schemas
    const schemas = {
        create: validationSchemas.create || Joi.object(),
        update: validationSchemas.update || Joi.object(),
        params: Joi.object({ id: Joi.string().required() })
    };

    // Standard CRUD operations with hooks
    const crud = {
        async create(data, userId = 'SYSTEM', req = null, res = null) {
            try {
                const processedData = await (hooks.beforeCreate?.(data, req, res) || data);
                const item = await Model.create({ ...processedData, created_by: userId });
                await (hooks.afterCreate?.(item, req, res));
                return item;
            } catch (error) {
                throw error;
            }
        },

        async findAll(query = {}, pagination = {}, req = null, res = null) {
            try {
                const { page = 1, limit = 10 } = pagination;
                const processedQuery = await (hooks.beforeFind?.(query, req, res) || query);

                // Check if limit is 'all' to fetch all items
                const fetchAll = limit === 'all' || limit === '-1';

                const queryOptions = {
                    where: processedQuery,
                    order: [['createdAt', 'DESC']]
                };

                // Only apply limit and offset if not fetching all items
                if (!fetchAll) {
                    queryOptions.limit = parseInt(limit);
                    queryOptions.offset = (parseInt(page) - 1) * parseInt(limit);
                }

                const result = await Model.findAndCountAll(queryOptions);

                await (hooks.afterFind?.(result, req, res));
                return result;
            } catch (error) {
                throw error;
            }
        },

        async findById(id, req = null, res = null) {
            try {
                const processedId = await (hooks.beforeFindOne?.(id, req, res) || id);
                const item = await Model.findByPk(processedId);
                await (hooks.afterFindOne?.(item, req, res));
                return item;
            } catch (error) {
                throw error;
            }
        },

        async update(id, data, userId = 'SYSTEM', req = null, res = null) {
            try {
                const item = await Model.findByPk(id);
                if (!item) return null;

                const processedData = await (hooks.beforeUpdate?.(data, req, res) || data);
                const updatedItem = await item.update({ ...processedData, updated_by: userId });
                await (hooks.afterUpdate?.(updatedItem, req, res));
                return updatedItem;
            } catch (error) {
                throw error;
            }
        },

        async delete(id, req = null, res = null) {
            try {
                const item = await Model.findByPk(id);
                if (!item) return null;

                await (hooks.beforeDelete?.(item, req, res) || true);
                await item.destroy();
                await (hooks.afterDelete?.(item, req, res));
                return item;
            } catch (error) {
                throw error;
            }
        }
    };

    // Request handlers with standard responses
    const handlers = {
        create: {
            handler: async (req, res) => {
                try {
                    const item = await crud.create(req.body, req.user?.id, req, res);
                    return responseHandler.created(res, `${Model.name} created successfully`, item);
                } catch (error) {
                    return responseHandler.error(res, error.message);
                }
            }
        },
        get: {
            handler: async (req, res) => {
                try {
                    const { page, limit, ...filters } = req.query;
                    const { count, rows } = await crud.findAll(filters, { page, limit }, req, res);

                    // Check if fetching all items
                    const fetchAll = limit === 'all' || limit === '-1';
                    const effectiveLimit = fetchAll ? count : (limit || 10);

                    return responseHandler.success(res, `${Model.name}s fetched successfully`, {
                        items: rows,
                        total: count,
                        currentPage: fetchAll ? 1 : parseInt(page || 1),
                        totalPages: fetchAll ? 1 : Math.ceil(count / effectiveLimit),
                        hasMore: fetchAll ? false : (page - 1) * effectiveLimit + rows.length < count,
                        fetchedAll: fetchAll
                    });
                } catch (error) {
                    return responseHandler.error(res, error.message);
                }
            }
        },
        getById: {
            handler: async (req, res) => {
                try {
                    const item = await crud.findById(req.params.id, req, res);
                    if (!item) return responseHandler.notFound(res, `${Model.name} not found`);
                    return responseHandler.success(res, `${Model.name} fetched successfully`, item);
                } catch (error) {
                    return responseHandler.error(res, error.message);
                }
            }
        },
        update: {
            handler: async (req, res) => {
                try {
                    const item = await crud.update(req.params.id, req.body, req.user?.id, req, res);
                    if (!item) return responseHandler.notFound(res, `${Model.name} not found`);
                    return responseHandler.success(res, `${Model.name} updated successfully`, item);
                } catch (error) {
                    return responseHandler.error(res, error.message);
                }
            }
        },
        delete: {
            handler: async (req, res) => {
                try {
                    const item = await crud.delete(req.params.id, req, res);
                    if (!item) return responseHandler.notFound(res, `${Model.name} not found`);
                    return responseHandler.success(res, `${Model.name} deleted successfully`, item);
                } catch (error) {
                    return responseHandler.error(res, error.message);
                }
            }
        }
    };

    // Validation middleware
    const validators = {
        create: validator({ body: schemas.create }),
        update: validator({ params: schemas.params, body: schemas.update }),
        delete: validator({ params: schemas.params }),
        getById: validator({ params: schemas.params })
    };

    return { validators, handlers, crud };
};

export default createBaseController; 