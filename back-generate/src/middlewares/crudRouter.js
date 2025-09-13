import { Router } from 'express';

/**
 * Create a CRUD router with standard endpoints
 * @param {Object} options - Router options
 * @param {Object} options.model - Sequelize model
 * @param {Object} options.validators - Validation middleware
 * @param {Object} options.handlers - Route handlers
 * @param {Array} options.middleware - Global middleware for all routes
 * @param {Array} options.openRoutes - Routes that don't require authentication
 * @returns {Router} - Express router
 */
export default function crudRouter({
  model,
  validators = {},
  handlers = {},
  middleware = [],
  openRoutes = []
}) {
  const router = Router();
  
  // Helper to apply middleware conditionally based on route path
  const applyMiddleware = (path) => {
    return openRoutes.includes(path) ? [] : middleware;
  };
  
  // GET all records
  router.get('/', 
    ...applyMiddleware('findAll'), 
    handlers.findAll || ((req, res) => {
      res.status(501).json({ error: 'Not implemented' });
    })
  );
  
  // GET single record by ID
  router.get('/:id', 
    ...applyMiddleware('findOne'), 
    handlers.findOne || ((req, res) => {
      res.status(501).json({ error: 'Not implemented' });
    })
  );
  
  // POST create new record
  router.post('/', 
    ...applyMiddleware('create'),
    validators.create || ((req, res, next) => next()),
    handlers.create || ((req, res) => {
      res.status(501).json({ error: 'Not implemented' });
    })
  );
  
  // PUT update record
  router.put('/:id', 
    ...applyMiddleware('update'),
    validators.update || ((req, res, next) => next()),
    handlers.update || ((req, res) => {
      res.status(501).json({ error: 'Not implemented' });
    })
  );
  
  // DELETE record
  router.delete('/:id', 
    ...applyMiddleware('delete'), 
    handlers.delete || ((req, res) => {
      res.status(501).json({ error: 'Not implemented' });
    })
  );
  
  return router;
} 