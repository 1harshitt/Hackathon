import { Router } from 'express';

/**
 * Load routes dynamically
 * @param {Object} routes - Object containing route modules
 * @returns {Router} - Express router
 */
export default function routeLoader(routes) {
  const router = Router();
  
  // Register each route
  Object.entries(routes).forEach(([name, routeModule]) => {
    const path = `/${name}`;
    console.log(`📝 Registering route: ${path}`);
    router.use(path, routeModule);
  });
  
  return router;
} 