import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate an advanced model file with validation and hooks
 * @param {string} modelName - Name of the model
 * @param {Array} fields - Array of field objects with name, type, required, and validation
 * @returns {string} - Path to the generated file
 */
export const generateAdvancedModel = (modelName, fields) => {
  // Convert model name to proper format (first letter uppercase)
  const formattedModelName = modelName.charAt(0).toUpperCase() + modelName.slice(1).toLowerCase();
  
  // Create directory if it doesn't exist
  const modelsDir = path.join(__dirname, '..', '..', 'output', 'models');
  if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
  }
  
  // Generate field definitions with validation
  const fieldDefinitions = fields.map(field => {
    let fieldDef = `  ${field.name}: {
    type: DataTypes.${field.type.toUpperCase()},
    allowNull: ${field.required ? 'false' : 'true'}`;
    
    // Add unique constraint if specified
    if (field.unique) {
      fieldDef += `,
    unique: true`;
    }
    
    // Add default value if specified
    if (field.defaultValue !== undefined) {
      if (typeof field.defaultValue === 'string') {
        fieldDef += `,
    defaultValue: '${field.defaultValue}'`;
      } else {
        fieldDef += `,
    defaultValue: ${field.defaultValue}`;
      }
    }
    
    // Add validation if specified
    if (field.validation) {
      fieldDef += `,
    validate: {`;
      
      Object.entries(field.validation).forEach(([key, value]) => {
        if (typeof value === 'string') {
          fieldDef += `
      ${key}: '${value}',`;
        } else if (typeof value === 'boolean' || typeof value === 'number') {
          fieldDef += `
      ${key}: ${value},`;
        }
      });
      
      // Remove trailing comma
      fieldDef = fieldDef.replace(/,$/, '');
      
      fieldDef += `
    }`;
    }
    
    fieldDef += `
  }`;
    
    return fieldDef;
  }).join(',\n');
  
  // Create model content with hooks
  const modelContent = `const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ${formattedModelName} = sequelize.define('${modelName.toLowerCase()}', {
${fieldDefinitions}
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (instance, options) => {
      // Add any preprocessing logic here
      console.log('Creating new ${modelName.toLowerCase()}:', instance.dataValues);
    },
    beforeUpdate: (instance, options) => {
      // Add any preprocessing logic here
      console.log('Updating ${modelName.toLowerCase()}:', instance.dataValues);
    }
  }
});

module.exports = ${formattedModelName};`;
  
  // Write to file
  const filePath = path.join(modelsDir, `${modelName.toLowerCase()}.model.js`);
  fs.writeFileSync(filePath, modelContent);
  
  return filePath;
};

/**
 * Generate validation middleware for a model
 * @param {string} modelName - Name of the model
 * @param {Array} fields - Array of field objects
 * @returns {string} - Path to the generated file
 */
export const generateValidationMiddleware = (modelName, fields) => {
  // Create directory if it doesn't exist
  const middlewareDir = path.join(__dirname, '..', '..', 'output', 'middleware');
  if (!fs.existsSync(middlewareDir)) {
    fs.mkdirSync(middlewareDir, { recursive: true });
  }
  
  // Generate validation rules
  const validationRules = fields.map(field => {
    let rule = '';
    
    // Required fields
    if (field.required) {
      rule += `
    // Validate ${field.name}
    if (!req.body.${field.name}) {
      errors.push({ field: '${field.name}', message: '${field.name} is required' });
    }`;
    }
    
    // Type validation
    switch (field.type.toUpperCase()) {
      case 'STRING':
      case 'TEXT':
        rule += `
    if (req.body.${field.name} && typeof req.body.${field.name} !== 'string') {
      errors.push({ field: '${field.name}', message: '${field.name} must be a string' });
    }`;
        break;
      case 'INTEGER':
      case 'FLOAT':
        rule += `
    if (req.body.${field.name} && isNaN(Number(req.body.${field.name}))) {
      errors.push({ field: '${field.name}', message: '${field.name} must be a number' });
    }`;
        break;
      case 'BOOLEAN':
        rule += `
    if (req.body.${field.name} !== undefined && typeof req.body.${field.name} !== 'boolean') {
      errors.push({ field: '${field.name}', message: '${field.name} must be a boolean' });
    }`;
        break;
      case 'DATE':
        rule += `
    if (req.body.${field.name} && isNaN(Date.parse(req.body.${field.name}))) {
      errors.push({ field: '${field.name}', message: '${field.name} must be a valid date' });
    }`;
        break;
    }
    
    return rule;
  }).join('');
  
  // Create middleware content
  const middlewareContent = `// Validation middleware for ${modelName}
exports.validate${modelName.charAt(0).toUpperCase() + modelName.slice(1)} = (req, res, next) => {
  const errors = [];
  ${validationRules}
  
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  
  next();
};`;
  
  // Write to file
  const filePath = path.join(middlewareDir, `${modelName.toLowerCase()}.middleware.js`);
  fs.writeFileSync(filePath, middlewareContent);
  
  return filePath;
};

/**
 * Generate an advanced controller file with error handling and pagination
 * @param {string} modelName - Name of the model
 * @returns {string} - Path to the generated file
 */
export const generateAdvancedController = (modelName) => {
  // Convert model name to proper format (first letter uppercase)
  const formattedModelName = modelName.charAt(0).toUpperCase() + modelName.slice(1).toLowerCase();
  
  // Create directory if it doesn't exist
  const controllersDir = path.join(__dirname, '..', '..', 'output', 'controllers');
  if (!fs.existsSync(controllersDir)) {
    fs.mkdirSync(controllersDir, { recursive: true });
  }
  
  // Create controller content with pagination and error handling
  const controllerContent = `const ${formattedModelName} = require('../models/${modelName.toLowerCase()}.model');
const { Op } = require('sequelize');

// Get all records with pagination and filtering
exports.findAll = async (req, res) => {
  const { page = 1, size = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
  const limit = parseInt(size);
  const offset = (parseInt(page) - 1) * limit;
  
  try {
    // Build filter conditions
    const condition = search ? {
      [Op.or]: [
        // Add searchable fields here
        // { fieldName: { [Op.like]: \`%\${search}%\` } },
      ]
    } : {};
    
    // Execute query with pagination
    const { count, rows } = await ${formattedModelName}.findAndCountAll({
      where: condition,
      limit,
      offset,
      order: [[sortBy, sortOrder]]
    });
    
    res.json({
      totalItems: count,
      items: rows,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Some error occurred while retrieving data.'
    });
  }
};

// Get a single record by id
exports.findOne = async (req, res) => {
  const id = req.params.id;
  
  try {
    const data = await ${formattedModelName}.findByPk(id);
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({
        message: \`\${formattedModelName} with id \${id} not found\`
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Error retrieving data'
    });
  }
};

// Create a new record
exports.create = async (req, res) => {
  try {
    const data = await ${formattedModelName}.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: err.errors.map(e => e.message)
      });
    }
    res.status(500).json({
      message: err.message || 'Some error occurred while creating the record.'
    });
  }
};

// Update a record
exports.update = async (req, res) => {
  const id = req.params.id;
  
  try {
    const [updated] = await ${formattedModelName}.update(req.body, {
      where: { id: id }
    });
    
    if (updated) {
      const updatedData = await ${formattedModelName}.findByPk(id);
      res.json(updatedData);
    } else {
      res.status(404).json({
        message: \`\${formattedModelName} with id \${id} not found\`
      });
    }
  } catch (err) {
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: err.errors.map(e => e.message)
      });
    }
    res.status(500).json({
      message: err.message || 'Error updating record'
    });
  }
};

// Delete a record
exports.delete = async (req, res) => {
  const id = req.params.id;
  
  try {
    const deleted = await ${formattedModelName}.destroy({
      where: { id: id }
    });
    
    if (deleted) {
      res.json({
        message: 'Record was deleted successfully!'
      });
    } else {
      res.status(404).json({
        message: \`\${formattedModelName} with id \${id} not found\`
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Error deleting record'
    });
  }
};`;
  
  // Write to file
  const filePath = path.join(controllersDir, `${modelName.toLowerCase()}.controller.js`);
  fs.writeFileSync(filePath, controllerContent);
  
  return filePath;
};

/**
 * Generate advanced routes file with validation middleware
 * @param {string} modelName - Name of the model
 * @returns {string} - Path to the generated file
 */
export const generateAdvancedRoutes = (modelName) => {
  // Create directory if it doesn't exist
  const routesDir = path.join(__dirname, '..', '..', 'output', 'routes');
  if (!fs.existsSync(routesDir)) {
    fs.mkdirSync(routesDir, { recursive: true });
  }
  
  // Create routes content with validation middleware
  const routesContent = `const express = require('express');
const router = express.Router();
const ${modelName.toLowerCase()}Controller = require('../controllers/${modelName.toLowerCase()}.controller');
const ${modelName.toLowerCase()}Middleware = require('../middleware/${modelName.toLowerCase()}.middleware');

// Create a new record with validation
router.post('/', ${modelName.toLowerCase()}Middleware.validate${modelName.charAt(0).toUpperCase() + modelName.slice(1)}, ${modelName.toLowerCase()}Controller.create);

// Get all records with pagination
router.get('/', ${modelName.toLowerCase()}Controller.findAll);

// Get a single record
router.get('/:id', ${modelName.toLowerCase()}Controller.findOne);

// Update a record with validation
router.put('/:id', ${modelName.toLowerCase()}Middleware.validate${modelName.charAt(0).toUpperCase() + modelName.slice(1)}, ${modelName.toLowerCase()}Controller.update);

// Delete a record
router.delete('/:id', ${modelName.toLowerCase()}Controller.delete);

module.exports = router;`;
  
  // Write to file
  const filePath = path.join(routesDir, `${modelName.toLowerCase()}.routes.js`);
  fs.writeFileSync(filePath, routesContent);
  
  return filePath;
};

/**
 * Generate a database configuration file
 * @returns {string} - Path to the generated file
 */
export const generateDatabaseConfig = () => {
  // Create directory if it doesn't exist
  const configDir = path.join(__dirname, '..', '..', 'output', 'config');
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  
  // Create config content
  const configContent = `const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || 'database',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;`;
  
  // Write to file
  const filePath = path.join(configDir, 'database.js');
  fs.writeFileSync(filePath, configContent);
  
  return filePath;
};

/**
 * Generate a main server file
 * @param {Array} models - Array of model names
 * @returns {string} - Path to the generated file
 */
export const generateServerFile = (models) => {
  // Create directory if it doesn't exist
  const outputDir = path.join(__dirname, '..', '..', 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Generate route imports and registrations
  const routeImports = models.map(model => 
    `const ${model.toLowerCase()}Routes = require('./routes/${model.toLowerCase()}.routes');`
  ).join('\n');
  
  const routeRegistrations = models.map(model => 
    `app.use('/api/${model.toLowerCase()}s', ${model.toLowerCase()}Routes);`
  ).join('\n');
  
  // Create server content
  const serverContent = `const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

// Import routes
${routeImports}

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
${routeRegistrations}

// Sync database and start server
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced successfully');
    
    // Start server
    app.listen(PORT, () => {
      console.log(\`Server is running on port \${PORT}\`);
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });`;
  
  // Write to file
  const filePath = path.join(outputDir, 'server.js');
  fs.writeFileSync(filePath, serverContent);
  
  return filePath;
};

/**
 * Generate all advanced files for multiple models
 * @param {Array} modelConfigs - Array of model configuration objects
 * @returns {Object} - Paths to the generated files
 */
export const generateAdvancedProject = (modelConfigs) => {
  const results = {
    models: [],
    controllers: [],
    routes: [],
    middleware: []
  };
  
  // Generate database config
  const dbConfigPath = generateDatabaseConfig();
  results.dbConfig = dbConfigPath;
  
  // Generate files for each model
  modelConfigs.forEach(config => {
    const { modelName, fields } = config;
    
    // Generate model
    const modelPath = generateAdvancedModel(modelName, fields);
    results.models.push(modelPath);
    
    // Generate controller
    const controllerPath = generateAdvancedController(modelName);
    results.controllers.push(controllerPath);
    
    // Generate validation middleware
    const middlewarePath = generateValidationMiddleware(modelName, fields);
    results.middleware.push(middlewarePath);
    
    // Generate routes
    const routesPath = generateAdvancedRoutes(modelName);
    results.routes.push(routesPath);
  });
  
  // Generate server file
  const modelNames = modelConfigs.map(config => config.modelName);
  const serverPath = generateServerFile(modelNames);
  results.server = serverPath;
  
  return results;
}; 