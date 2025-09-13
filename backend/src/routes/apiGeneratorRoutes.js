import { Router } from 'express';
import ApiGenerator from '../models/apiGeneratorModel.js';
import crudRouter from '../middlewares/crudRouter.js';
import { validators, handlers } from '../controllers/apiGeneratorController.js';
import authenticateUser from '../middlewares/index.js';

const router = crudRouter({
    model: ApiGenerator,
    validators,
    handlers,
    middleware: [authenticateUser],
    openRoutes: []
});

export default router; 