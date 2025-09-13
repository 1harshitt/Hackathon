import { Router } from 'express';

const routes = {
    create: { method: 'post', path: '/' },
    get: { method: 'get', path: '/' },
    getById: { method: 'get', path: '/:id' },
    update: { method: 'put', path: '/:id' },
    delete: { method: 'delete', path: '/:id' }
};

const crudRouter = ({
    model,
    validators = {},
    handlers = {},
    middleware = [],
    openRoutes = [],
    extraMiddleware = {}
}) => {
    const router = Router();

    const getMiddleware = (route) => {
        const baseMiddleware = openRoutes.includes(route) ? [] : middleware;
        const extraRouteMiddleware = extraMiddleware[route] || [];
        return [...baseMiddleware, ...extraRouteMiddleware];
    };

    Object.entries(routes).forEach(([route, { method, path }]) => {
        if (handlers[route]?.handler) {
            router[method](
                path,
                ...getMiddleware(route),
                validators[route] || [],
                handlers[route].handler
            );
        }
    });

    return router;
};

export default crudRouter; 