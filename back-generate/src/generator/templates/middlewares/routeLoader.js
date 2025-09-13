import { Router } from 'express';

const routeLoader = (routes) => {
    const router = Router();

    Object.entries(routes).forEach(([name, handler]) => {
        router.use(`/${name}`, handler);
    });

    return router;
};

export default routeLoader; 