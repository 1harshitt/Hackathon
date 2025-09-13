import Role from '../models/roleModel.js';
import crudRouter from '../middlewares/crudRouter.js';
import { validators, handlers } from '../controllers/roleController.js';
import authenticateUser from '../middlewares/index.js';

export default crudRouter({
    model: Role,
    validators,
    handlers,
    middleware: [authenticateUser],
    openRoutes: []
});
