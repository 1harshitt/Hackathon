import Lead from '../models/leadModel.js';
import crudRouter from '../middlewares/crudRouter.js';
import { validators, handlers } from '../controllers/leadController.js';
import authenticateUser from '../middlewares/index.js';

export default crudRouter({
    model: Lead,
    validators,
    handlers,
    middleware: [authenticateUser],
    openRoutes: []
});
