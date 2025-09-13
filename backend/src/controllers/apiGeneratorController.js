import Joi from 'joi';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ApiGenerator from '../models/apiGeneratorModel.js';
import createBaseController from './conrollersUtils/baseController.js';
import responseHandler from '../utils/responseHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validation schemas
const validationSchemas = {
    create: Joi.object({
        module_name: Joi.string().required().min(3).max(50).regex(/^[a-zA-Z][a-zA-Z0-9]*$/),
        fields: Joi.array().items(
            Joi.object({
                name: Joi.string().required(),
                type: Joi.string().required().valid(
                    'STRING', 'INTEGER', 'FLOAT', 'BOOLEAN', 
                    'TEXT', 'DATE', 'JSON', 'ENUM'
                ),
                allowNull: Joi.boolean().default(true),
                unique: Joi.boolean().default(false),
                defaultValue: Joi.any(),
                validate: Joi.object().optional(),
                enumValues: Joi.array().when('type', {
                    is: 'ENUM',
                    then: Joi.array().items(Joi.string()).required(),
                    otherwise: Joi.forbidden()
                })
            })
        ).min(1).required(),
        requirements: Joi.object({
            authentication: Joi.boolean().default(true),
            openRoutes: Joi.array().items(Joi.string()).default([]),
            relations: Joi.array().items(
                Joi.object({
                    model: Joi.string().required(),
                    type: Joi.string().valid('hasOne', 'hasMany', 'belongsTo', 'belongsToMany').required(),
                    foreignKey: Joi.string().optional(),
                    as: Joi.string().optional()
                })
            ).default([])
        }).default({})
    }),
    update: Joi.object({
        module_name: Joi.string().min(3).max(50).regex(/^[a-zA-Z][a-zA-Z0-9]*$/),
        fields: Joi.array().items(
            Joi.object({
                name: Joi.string().required(),
                type: Joi.string().required().valid(
                    'STRING', 'INTEGER', 'FLOAT', 'BOOLEAN', 
                    'TEXT', 'DATE', 'JSON', 'ENUM'
                ),
                allowNull: Joi.boolean().default(true),
                unique: Joi.boolean().default(false),
                defaultValue: Joi.any(),
                validate: Joi.object().optional(),
                enumValues: Joi.array().when('type', {
                    is: 'ENUM',
                    then: Joi.array().items(Joi.string()).required(),
                    otherwise: Joi.forbidden()
                })
            })
        ),
        requirements: Joi.object({
            authentication: Joi.boolean(),
            openRoutes: Joi.array().items(Joi.string()),
            relations: Joi.array().items(
                Joi.object({
                    model: Joi.string().required(),
                    type: Joi.string().valid('hasOne', 'hasMany', 'belongsTo', 'belongsToMany').required(),
                    foreignKey: Joi.string().optional(),
                    as: Joi.string().optional()
                })
            )
        })
    })
};

// Custom hooks for API generator
const hooks = {
    afterCreate: async (item) => {
        try {
            // Generate API files after creation
            await generateApiFiles(item);
            return item;
        } catch (error) {
            console.error("Error generating API files:", error);
            await item.update({
                status: 'failed',
                error_message: error.message
            });
            throw error;
        }
    },
    beforeDelete: async (item) => {
        try {
            console.log("beforeDelete hook called for:", item.module_name);
            // Delete generated files before deleting the record
            await deleteGeneratedFiles(item);
            return item;
        } catch (error) {
            console.error("Error deleting API files:", error);
            // Don't throw error, continue with deletion
            return item;
        }
    }
};

// Function to generate model file
const generateModelFile = async (apiData) => {
    const { module_name, fields } = apiData;
    const modelName = module_name.charAt(0).toUpperCase() + module_name.slice(1);
    const fileName = `${module_name}Model.js`;
    const filePath = path.join(__dirname, '..', 'models', fileName);
    
    // Check if file already exists
    if (fs.existsSync(filePath)) {
        throw new Error(`Model file ${fileName} already exists`);
    }
    
    // Generate field definitions
    const fieldDefinitions = fields.map(field => {
        let fieldDef = `    ${field.name}: {
        type: DataTypes.${field.type}`;
        
        if (field.type === 'ENUM' && field.enumValues) {
            fieldDef += `,\n        values: ['${field.enumValues.join("', '")}']`;
        }
        
        if (field.allowNull !== undefined) {
            fieldDef += `,\n        allowNull: ${field.allowNull}`;
        }
        
        if (field.unique !== undefined) {
            fieldDef += `,\n        unique: ${field.unique}`;
        }
        
        if (field.defaultValue !== undefined && field.defaultValue !== null) {
            if (typeof field.defaultValue === 'string') {
                fieldDef += `,\n        defaultValue: '${field.defaultValue}'`;
            } else if (typeof field.defaultValue === 'object') {
                fieldDef += `,\n        defaultValue: ${JSON.stringify(field.defaultValue)}`;
            } else {
                fieldDef += `,\n        defaultValue: ${field.defaultValue}`;
            }
        }
        
        // Add validation if provided
        if (field.validate && Object.keys(field.validate).length > 0) {
            fieldDef += `,\n        validate: ${JSON.stringify(field.validate)}`;
        }
        
        fieldDef += '\n    }';
        return fieldDef;
    }).join(',\n');
    
    // Create model content
    const modelContent = `import { DataTypes, sequelize, createBaseModel } from './modelUtils/modelUtils.js';

const ${module_name}Attributes = {
${fieldDefinitions}
};

const ${modelName} = createBaseModel(sequelize, '${modelName}', ${module_name}Attributes);

export default ${modelName};`;

    // Write file
    fs.writeFileSync(filePath, modelContent);
    return fileName;
};

// Function to generate controller file
const generateControllerFile = async (apiData) => {
    const { module_name, fields, requirements } = apiData;
    const modelName = module_name.charAt(0).toUpperCase() + module_name.slice(1);
    const fileName = `${module_name}Controller.js`;
    const filePath = path.join(__dirname, fileName);
    
    // Check if file already exists
    if (fs.existsSync(filePath)) {
        throw new Error(`Controller file ${fileName} already exists`);
    }
    
    // Generate validation schema
    const validationFields = fields.map(field => {
        let validation = `        ${field.name}: Joi.${getJoiType(field.type)}()`;
        
        if (!field.allowNull) {
            validation += '.required()';
        } else {
            validation += '.optional()';
            if (field.defaultValue === null) {
                validation += '.allow(null)';
            }
        }
        
        if (field.type === 'ENUM' && field.enumValues) {
            validation += `.valid('${field.enumValues.join("', '")}')`;
        }
        
        return validation;
    }).join(',\n');
    
    // Create controller content
    const controllerContent = `import Joi from 'joi';
import ${modelName} from '../models/${module_name}Model.js';
import createBaseController from './conrollersUtils/baseController.js';

const validationSchemas = {
    create: Joi.object({
${validationFields}
    }),
    update: Joi.object({
${validationFields}
    })
};

const hooks = {
    beforeCreate: async (data) => data,
    beforeUpdate: async (data) => data,
    beforeFind: (query) => query
};

const { validators, handlers, crud } = createBaseController(${modelName}, validationSchemas, hooks);

export { validators, handlers, crud };`;

    // Write file
    fs.writeFileSync(filePath, controllerContent);
    return fileName;
};

// Function to generate routes file
const generateRoutesFile = async (apiData) => {
    const { module_name, requirements } = apiData;
    const modelName = module_name.charAt(0).toUpperCase() + module_name.slice(1);
    const fileName = `${module_name}Routes.js`;
    const filePath = path.join(__dirname, '..', 'routes', fileName);
    
    // Check if file already exists
    if (fs.existsSync(filePath)) {
        throw new Error(`Routes file ${fileName} already exists`);
    }
    
    // Create routes content
    const routesContent = `import ${modelName} from '../models/${module_name}Model.js';
import crudRouter from '../middlewares/crudRouter.js';
import { validators, handlers } from '../controllers/${module_name}Controller.js';
import authenticateUser from '../middlewares/index.js';

export default crudRouter({
    model: ${modelName},
    validators,
    handlers,
    middleware: [${requirements.authentication ? 'authenticateUser' : ''}],
    openRoutes: [${requirements.openRoutes.map(route => `'${route}'`).join(', ')}]
});`;

    // Write file
    fs.writeFileSync(filePath, routesContent);
    return fileName;
};

// Update main routes index.js to include the new route
const updateMainRoutes = async (apiData) => {
    const { module_name } = apiData;
    const indexPath = path.join(__dirname, '..', 'routes', 'index.js');
    
    // Read current index.js content
    const currentContent = fs.readFileSync(indexPath, 'utf8');
    
    // Check if route already exists
    if (currentContent.includes(`import ${module_name} from`)) {
        return false; // Route already exists
    }
    
    // Find import section and routes object
    const importLines = currentContent.split('\n').filter(line => line.startsWith('import '));
    const lastImport = importLines[importLines.length - 1];
    const lastImportIndex = currentContent.indexOf(lastImport) + lastImport.length;
    
    // Add new import
    const newImport = `\nimport ${module_name} from './${module_name}Routes.js';`;
    
    // Find routes object
    const routesStart = currentContent.indexOf('const routes = {');
    const routesEnd = currentContent.indexOf('};', routesStart) + 1;
    const routesContent = currentContent.substring(routesStart, routesEnd);
    
    // Add new route to routes object
    const lastCommaIndex = routesContent.lastIndexOf(',');
    const insertIndex = lastCommaIndex !== -1 ? lastCommaIndex + 1 : routesContent.indexOf('}');
    const newRoutesContent = routesContent.substring(0, insertIndex) + 
        `\n    ${module_name},` + 
        routesContent.substring(insertIndex);
    
    // Create updated content
    const updatedContent = 
        currentContent.substring(0, lastImportIndex) + 
        newImport + 
        currentContent.substring(lastImportIndex, routesStart) + 
        newRoutesContent + 
        currentContent.substring(routesEnd);
    
    // Write updated content
    fs.writeFileSync(indexPath, updatedContent);
    return true;
};

// Update models index.js to include the new model
const updateModelsIndex = async (apiData) => {
    const { module_name } = apiData;
    const modelName = module_name.charAt(0).toUpperCase() + module_name.slice(1);
    const indexPath = path.join(__dirname, '..', 'models', 'index.js');
    
    // Read current index.js content
    const currentContent = fs.readFileSync(indexPath, 'utf8');
    
    // Check if model already exists
    if (currentContent.includes(`import "./${module_name}Model.js"`)) {
        return false; // Model already exists
    }
    
    // Add new import
    const newImport = `import "./${module_name}Model.js";\n`;
    
    // Create updated content
    const updatedContent = newImport + currentContent;
    
    // Write updated content
    fs.writeFileSync(indexPath, updatedContent);
    return true;
};

// Helper function to map Sequelize types to Joi types
const getJoiType = (sequelizeType) => {
    const typeMap = {
        'STRING': 'string',
        'TEXT': 'string',
        'INTEGER': 'number',
        'FLOAT': 'number',
        'BOOLEAN': 'boolean',
        'DATE': 'date',
        'JSON': 'object',
        'ENUM': 'string'
    };
    
    return typeMap[sequelizeType] || 'string';
};

// Main function to generate all API files
const generateApiFiles = async (apiData) => {
    try {
        const generatedFiles = [];
        
        // Generate model file
        const modelFile = await generateModelFile(apiData);
        generatedFiles.push({ type: 'model', file: modelFile });
        
        // Generate controller file
        const controllerFile = await generateControllerFile(apiData);
        generatedFiles.push({ type: 'controller', file: controllerFile });
        
        // Generate routes file
        const routesFile = await generateRoutesFile(apiData);
        generatedFiles.push({ type: 'routes', file: routesFile });
        
        // Update main routes file
        await updateMainRoutes(apiData);
        
        // Update models index file
        await updateModelsIndex(apiData);
        
        // Update status in database
        await apiData.update({
            status: 'generated',
            generated_files: generatedFiles,
            error_message: null
        });
        
        return generatedFiles;
    } catch (error) {
        await apiData.update({
            status: 'failed',
            error_message: error.message
        });
        throw error;
    }
};

// Function to delete generated files
const deleteGeneratedFiles = async (apiData) => {
    try {
        const { module_name, generated_files } = apiData;
        
        let files = [];
        try {
            // Check if generated_files is a string or already an object
            if (typeof generated_files === 'string') {
                files = JSON.parse(generated_files);
            } else if (Array.isArray(generated_files)) {
                files = generated_files;
            } else {
                console.log('No valid generated files to delete');
                return;
            }
        } catch (error) {
            console.error('Error parsing generated_files:', error);
            return;
        }
        
        if (!files || !Array.isArray(files) || files.length === 0) {
            console.log('No generated files to delete');
            return;
        }
        
        console.log('Deleting files:', files);
        
        // Delete model file
        const modelFile = files.find(f => f.type === 'model');
        if (modelFile) {
            const modelPath = path.join(__dirname, '..', 'models', modelFile.file);
            if (fs.existsSync(modelPath)) {
                fs.unlinkSync(modelPath);
                console.log(`Deleted model file: ${modelPath}`);
            }
        }
        
        // Delete controller file
        const controllerFile = files.find(f => f.type === 'controller');
        if (controllerFile) {
            const controllerPath = path.join(__dirname, '..', 'controllers', controllerFile.file);
            if (fs.existsSync(controllerPath)) {
                fs.unlinkSync(controllerPath);
                console.log(`Deleted controller file: ${controllerPath}`);
            }
        }
        
        // Delete routes file
        const routesFile = files.find(f => f.type === 'routes');
        if (routesFile) {
            const routesPath = path.join(__dirname, '..', 'routes', routesFile.file);
            if (fs.existsSync(routesPath)) {
                fs.unlinkSync(routesPath);
                console.log(`Deleted routes file: ${routesPath}`);
            }
        }
        
        // Update main routes index.js to remove the route
        await removeFromMainRoutes(module_name);
        
        // Update models index.js to remove the model import
        await removeFromModelsIndex(module_name);
        
        return true;
    } catch (error) {
        console.error('Error deleting generated files:', error);
        throw error;
    }
};

// Remove route from main routes index.js
const removeFromMainRoutes = async (module_name) => {
    try {
        const indexPath = path.join(__dirname, '..', 'routes', 'index.js');
        
        // Check if file exists
        if (!fs.existsSync(indexPath)) {
            console.log(`Routes index file not found: ${indexPath}`);
            return false;
        }
        
        // Read current index.js content
        let currentContent = fs.readFileSync(indexPath, 'utf8');
        
        // Remove import line
        const importRegex = new RegExp(`import ${module_name} from './${module_name}Routes.js';\\n?`, 'g');
        currentContent = currentContent.replace(importRegex, '');
        
        // Remove from routes object
        const routeRegex = new RegExp(`\\s*${module_name},\\n?`, 'g');
        currentContent = currentContent.replace(routeRegex, '');
        
        // Write updated content
        fs.writeFileSync(indexPath, currentContent);
        console.log(`Removed ${module_name} from routes/index.js`);
        return true;
    } catch (error) {
        console.error(`Error removing ${module_name} from routes/index.js:`, error);
        return false;
    }
};

// Remove model from models index.js
const removeFromModelsIndex = async (module_name) => {
    try {
        const modelName = module_name.charAt(0).toUpperCase() + module_name.slice(1);
        const indexPath = path.join(__dirname, '..', 'models', 'index.js');
        
        // Check if file exists
        if (!fs.existsSync(indexPath)) {
            console.log(`Models index file not found: ${indexPath}`);
            return false;
        }
        
        // Read current index.js content
        let currentContent = fs.readFileSync(indexPath, 'utf8');
        
        // More flexible regex that matches both import formats
        const importRegex = new RegExp(`import "./${module_name}Model.js";\\n?`, 'g');
        
        // Try all regex patterns
        currentContent = currentContent.replace(importRegex, '');
        
        // Write updated content
        fs.writeFileSync(indexPath, currentContent);
        console.log(`Removed ${modelName} from models/index.js`);
        return true;
    } catch (error) {
        console.error(`Error removing ${module_name} from models/index.js:`, error);
        return false;
    }
};

// Create base controller with our custom hooks
const { validators, handlers, crud } = createBaseController(ApiGenerator, validationSchemas, hooks);

// Export all handlers and validators
export { validators, handlers, crud }; 