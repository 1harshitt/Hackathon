import Document from '../models/documentModel.js';
import crudRouter from '../middlewares/crudRouter.js';
import { validators, handlers, uploadHandler } from '../controllers/documentController.js';
import express from 'express';

// Create the base CRUD router
const router = crudRouter({
    model: Document,
    validators,
    handlers,
    middleware: [], // No authentication middleware
    openRoutes: ['get', 'post', 'put', 'delete'] // All routes are open
});

// Add custom file upload route
router.post('/upload',
    validators.create,
    uploadHandler
);

export default router;