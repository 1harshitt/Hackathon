import Filter from '../models/filterModel.js';
import crudRouter from '../middlewares/crudRouter.js';
import { validators, handlers } from '../controllers/filterController.js';
import authenticateUser from '../middlewares/index.js';

export default crudRouter({
    model: Filter,
    validators,
    handlers,
    middleware: [authenticateUser],
    openRoutes: []
}); 