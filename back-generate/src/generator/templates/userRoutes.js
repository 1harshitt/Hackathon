export function generateUserRoutes() {
  return `import User from '../models/UserModel.js';
import crudRouter from '../middlewares/crudRouter.js';
import { validators, handlers } from '../controllers/UserController.js';
import authenticateUser from '../middlewares/index.js';

export default crudRouter({
    model: User,
    validators,
    handlers,
    middleware: [authenticateUser],
    openRoutes: ['create'] // Allow user registration without authentication
});`;
} 