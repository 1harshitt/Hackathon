import Pipeline from '../models/pipelineModel.js';
import crudRouter from '../middlewares/crudRouter.js';
import { validators, handlers } from '../controllers/pipelineController.js';
import authenticateUser from '../middlewares/index.js';

export default crudRouter({
    model: Pipeline,
    validators,
    handlers,
    middleware: [authenticateUser],
    openRoutes: []
});
