import Contact from '../models/contactModel.js';
import crudRouter from '../middlewares/crudRouter.js';
import { validators, handlers } from '../controllers/contactController.js';
import authenticateUser from '../middlewares/index.js';

export default crudRouter({
    model: Contact,
    validators,
    handlers,
    middleware: [authenticateUser],
    openRoutes: ['get']
});