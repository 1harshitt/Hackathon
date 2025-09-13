export function generateRoute(modelName) {
  const capitalizedModelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
  
  return `import ${capitalizedModelName} from '../models/${modelName}Model.js';
import crudRouter from '../middlewares/crudRouter.js';
import { validators, handlers } from '../controllers/${modelName}Controller.js';
import authenticateUser from '../middlewares/index.js';

export default crudRouter({
    model: ${capitalizedModelName},
    validators,
    handlers,
    middleware: [authenticateUser],
    openRoutes: []
});`;
} 