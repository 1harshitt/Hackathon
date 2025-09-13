import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate a basic model file
 * @param {string} modelName - Name of the model
 * @param {Array} fields - Array of field objects with name and type
 * @returns {string} - Path to the generated file
 */
export const generateBasicModel = (modelName, fields) => {
  // Convert model name to proper format (first letter uppercase)
  const formattedModelName = modelName.charAt(0).toUpperCase() + modelName.slice(1).toLowerCase();
  
  // Create directory if it doesn't exist
  const modelsDir = path.join(__dirname, '..', '..', 'output', 'models');
  if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
  }
  
  // Generate field definitions
  const fieldDefinitions = fields.map(field => {
    return `  ${field.name}: {
    type: DataTypes.${field.type.toUpperCase()},
    allowNull: ${field.required ? 'false' : 'true'}
  }`;
  }).join(',\n');
  
  // Create model content
  const modelContent = `const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ${formattedModelName} = sequelize.define('${modelName.toLowerCase()}', {
${fieldDefinitions}
}, {
  timestamps: true
});

module.exports = ${formattedModelName};`;
  
  // Write to file
  const filePath = path.join(modelsDir, `${modelName.toLowerCase()}.model.js`);
  fs.writeFileSync(filePath, modelContent);
  
  return filePath;
};

/**
 * Generate a basic controller file
 * @param {string} modelName - Name of the model
 * @returns {string} - Path to the generated file
 */
export const generateBasicController = (modelName) => {
  // Convert model name to proper format (first letter uppercase)
  const formattedModelName = modelName.charAt(0).toUpperCase() + modelName.slice(1).toLowerCase();
  
  // Create directory if it doesn't exist
  const controllersDir = path.join(__dirname, '..', '..', 'output', 'controllers');
  if (!fs.existsSync(controllersDir)) {
    fs.mkdirSync(controllersDir, { recursive: true });
  }
  
  // Create controller content
  const controllerContent = `const ${formattedModelName} = require('../models/${modelName.toLowerCase()}.model');

// Get all records
exports.findAll = async (req, res) => {
  try {
    const data = await ${formattedModelName}.findAll();
    res.json(data);
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
        message: \`Record with id \${id} not found\`
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
        message: \`Record with id \${id} not found\`
      });
    }
  } catch (err) {
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
        message: \`Record with id \${id} not found\`
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
 * Generate a basic routes file
 * @param {string} modelName - Name of the model
 * @returns {string} - Path to the generated file
 */
export const generateBasicRoutes = (modelName) => {
  // Create directory if it doesn't exist
  const routesDir = path.join(__dirname, '..', '..', 'output', 'routes');
  if (!fs.existsSync(routesDir)) {
    fs.mkdirSync(routesDir, { recursive: true });
  }
  
  // Create routes content
  const routesContent = `const express = require('express');
const router = express.Router();
const ${modelName.toLowerCase()}Controller = require('../controllers/${modelName.toLowerCase()}.controller');

// Create a new record
router.post('/', ${modelName.toLowerCase()}Controller.create);

// Get all records
router.get('/', ${modelName.toLowerCase()}Controller.findAll);

// Get a single record
router.get('/:id', ${modelName.toLowerCase()}Controller.findOne);

// Update a record
router.put('/:id', ${modelName.toLowerCase()}Controller.update);

// Delete a record
router.delete('/:id', ${modelName.toLowerCase()}Controller.delete);

module.exports = router;`;
  
  // Write to file
  const filePath = path.join(routesDir, `${modelName.toLowerCase()}.routes.js`);
  fs.writeFileSync(filePath, routesContent);
  
  return filePath;
};

/**
 * Generate all basic files for a model
 * @param {Object} options - Generation options
 * @param {string} options.modelName - Name of the model
 * @param {Array} options.fields - Array of field objects with name and type
 * @returns {Object} - Paths to the generated files
 */
export const generateBasicFiles = (options) => {
  const { modelName, fields } = options;
  
  const modelPath = generateBasicModel(modelName, fields);
  const controllerPath = generateBasicController(modelName);
  const routesPath = generateBasicRoutes(modelName);
  
  return {
    model: modelPath,
    controller: controllerPath,
    routes: routesPath
  };
}; 