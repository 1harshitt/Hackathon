import Stage from '../models/stageModel.js';
import crudRouter from '../middlewares/crudRouter.js';
import { validators, handlers } from '../controllers/stageController.js';
import authenticateUser from '../middlewares/index.js';

export default crudRouter({
    model: Stage,
    validators,
    handlers,
    middleware: [authenticateUser],
    openRoutes: []
});
