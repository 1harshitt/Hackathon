import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateModel } from './templates/modelTemplate.js';
import { generateController } from './templates/controllerTemplate.js';
import { generateRoute } from './templates/routeTemplate.js';
import { generateUserModel } from './templates/userModel.js';
import { generateUserController } from './templates/userController.js';
import { generateUserRoutes } from './templates/userRoutes.js';
import { generateAuthModel } from './templates/authModel.js';
import { generateRoleModel } from './templates/roleModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate backend code based on model definition
 * @param {string} modelName - Name of the model
 * @param {Array} fields - Array of field objects with name, type, and required properties
 * @param {boolean} generateInBackend - Whether to also generate files in the backend directory
 * @returns {Object} - Paths to the generated files
 */
export async function generateBackendCode(modelName, fields, generateInBackend = true) {
  // Create output directory if it doesn't exist
  const outputDir = path.join(__dirname, '../../output');
  const modelsDir = path.join(outputDir, 'models');
  const controllersDir = path.join(outputDir, 'controllers');
  const routesDir = path.join(outputDir, 'routes');
  
  // Create directories if they don't exist
  [outputDir, modelsDir, controllersDir, routesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Generate model code
  const modelCode = generateModel(modelName, fields);
  const modelPath = path.join(modelsDir, `${modelName}Model.js`);
  fs.writeFileSync(modelPath, modelCode);
  
  // Update models index.js to import the new model
  await updateModelsIndex(modelName, outputDir);
  
  // Generate controller code
  const controllerCode = generateController(modelName, fields);
  const controllerPath = path.join(controllersDir, `${modelName}Controller.js`);
  fs.writeFileSync(controllerPath, controllerCode);
  
  // Generate route code
  const routeCode = generateRoute(modelName);
  const routePath = path.join(routesDir, `${modelName}Routes.js`);
  fs.writeFileSync(routePath, routeCode);
  
  // Copy utility files if they don't exist
  await copyUtilityFiles(outputDir);

  // Generate files in backend directory if requested
  if (generateInBackend) {
    await generateFilesInBackend(modelName, fields);
  }
  
  return {
    model: modelPath,
    controller: controllerPath,
    route: routePath
  };
}

/**
 * Generate user, auth, and role models and related files
 * @param {boolean} generateInBackend - Whether to also generate files in the backend directory
 * @returns {Object} - Paths to the generated files
 */
export async function generateAuthSystem(generateInBackend = true) {
  // Create output directory if it doesn't exist
  const outputDir = path.join(__dirname, '../../output');
  const modelsDir = path.join(outputDir, 'models');
  const controllersDir = path.join(outputDir, 'controllers');
  const routesDir = path.join(outputDir, 'routes');
  
  // Create directories if they don't exist
  [outputDir, modelsDir, controllersDir, routesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Generate User model, controller, and routes
  const userModelCode = generateUserModel();
  const userModelPath = path.join(modelsDir, 'UserModel.js');
  fs.writeFileSync(userModelPath, userModelCode);
  
  const userControllerCode = generateUserController();
  const userControllerPath = path.join(controllersDir, 'UserController.js');
  fs.writeFileSync(userControllerPath, userControllerCode);
  
  const userRoutesCode = generateUserRoutes();
  const userRoutesPath = path.join(routesDir, 'userRoutes.js');
  fs.writeFileSync(userRoutesPath, userRoutesCode);
  
  // Generate Auth model
  const authModelCode = generateAuthModel();
  const authModelPath = path.join(modelsDir, 'authModel.js');
  fs.writeFileSync(authModelPath, authModelCode);
  
  // Generate Role model
  const roleModelCode = generateRoleModel();
  const roleModelPath = path.join(modelsDir, 'roleModel.js');
  fs.writeFileSync(roleModelPath, roleModelCode);
  
  // Copy utility files if they don't exist
  await copyUtilityFiles(outputDir);

  // Generate files in backend directory if requested
  if (generateInBackend) {
    await generateAuthSystemInBackend();
  }
  
  console.log('✅ Generated auth system files in output directory');
  
  return {
    userModel: userModelPath,
    userController: userControllerPath,
    userRoutes: userRoutesPath,
    authModel: authModelPath,
    roleModel: roleModelPath
  };
}

/**
 * Generate user, auth, and role models and related files in backend directory
 */
async function generateAuthSystemInBackend() {
  // Path to backend directory (assuming it's at the same level as back-generate)
  const backendDir = path.join(__dirname, '../../../backend');
  
  // Check if backend directory exists
  if (!fs.existsSync(backendDir)) {
    console.log('⚠️ Backend directory not found. Skipping backend file generation.');
    return;
  }

  const backendSrcDir = path.join(backendDir, 'src');
  const modelsDir = path.join(backendSrcDir, 'models');
  const controllersDir = path.join(backendSrcDir, 'controllers');
  const routesDir = path.join(backendSrcDir, 'routes');
  
  // Create directories if they don't exist
  [backendSrcDir, modelsDir, controllersDir, routesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Generate User model, controller, and routes
  const userModelCode = generateUserModel();
  const userModelPath = path.join(modelsDir, 'UserModel.js');
  fs.writeFileSync(userModelPath, userModelCode);
  
  const userControllerCode = generateUserController();
  const userControllerPath = path.join(controllersDir, 'UserController.js');
  fs.writeFileSync(userControllerPath, userControllerCode);
  
  const userRoutesCode = generateUserRoutes();
  const userRoutesPath = path.join(routesDir, 'userRoutes.js');
  fs.writeFileSync(userRoutesPath, userRoutesCode);
  
  // Generate Auth model
  const authModelCode = generateAuthModel();
  const authModelPath = path.join(modelsDir, 'authModel.js');
  fs.writeFileSync(authModelPath, authModelCode);
  
  // Generate Role model
  const roleModelCode = generateRoleModel();
  const roleModelPath = path.join(modelsDir, 'roleModel.js');
  fs.writeFileSync(roleModelPath, roleModelCode);
  
  console.log('✅ Generated auth system files in backend directory');
}

/**
 * Generate files in the backend directory
 * @param {string} modelName - Name of the model
 * @param {Array} fields - Array of field objects
 */
async function generateFilesInBackend(modelName, fields) {
  // Path to backend directory (assuming it's at the same level as back-generate)
  const backendDir = path.join(__dirname, '../../../backend');
  
  // Check if backend directory exists
  if (!fs.existsSync(backendDir)) {
    console.log('⚠️ Backend directory not found. Skipping backend file generation.');
    return;
  }

  const backendSrcDir = path.join(backendDir, 'src');
  const modelsDir = path.join(backendSrcDir, 'models');
  const controllersDir = path.join(backendSrcDir, 'controllers');
  const routesDir = path.join(backendSrcDir, 'routes');
  
  // Create directories if they don't exist
  [backendSrcDir, modelsDir, controllersDir, routesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Generate model code
  const modelCode = generateModel(modelName, fields);
  const modelPath = path.join(modelsDir, `${modelName}Model.js`);
  fs.writeFileSync(modelPath, modelCode);
  
  // Generate controller code
  const controllerCode = generateController(modelName, fields);
  const controllerPath = path.join(controllersDir, `${modelName}Controller.js`);
  fs.writeFileSync(controllerPath, controllerCode);
  
  // Generate route code
  const routeCode = generateRoute(modelName);
  const routePath = path.join(routesDir, `${modelName}Routes.js`);
  fs.writeFileSync(routePath, routeCode);
  
  // Update backend models index if it exists
  const backendModelsIndexPath = path.join(modelsDir, 'index.js');
  if (fs.existsSync(backendModelsIndexPath)) {
    await updateModelsIndex(modelName, backendSrcDir);
  }
  
  console.log('✅ Generated files in backend directory:');
  console.log(`- Model: ${modelPath}`);
  console.log(`- Controller: ${controllerPath}`);
  console.log(`- Route: ${routePath}`);
}

/**
 * Copy utility files to the output directory
 * @param {string} outputDir - Output directory path
 */
async function copyUtilityFiles(outputDir) {
  const utilsDir = path.join(outputDir, 'utils');
  const configDir = path.join(outputDir, 'config');
  const middlewaresDir = path.join(outputDir, 'middlewares');
  const modelUtilsDir = path.join(outputDir, 'models/modelUtils');
  const controllerUtilsDir = path.join(outputDir, 'controllers/conrollersUtils');
  
  // Create directories if they don't exist
  [utilsDir, configDir, middlewaresDir, modelUtilsDir, controllerUtilsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Copy utility files
  const filesToCopy = [
    // Utils
    {
      src: path.join(__dirname, 'templates/utils/responseHandler.js'),
      dest: path.join(utilsDir, 'responseHandler.js')
    },
    {
      src: path.join(__dirname, 'templates/utils/validator.js'),
      dest: path.join(utilsDir, 'validator.js')
    },
    // Config
    {
      src: path.join(__dirname, 'templates/config/config.js'),
      dest: path.join(configDir, 'config.js')
    },
    {
      src: path.join(__dirname, 'templates/config/db.js'),
      dest: path.join(configDir, 'db.js')
    },
    // Middlewares
    {
      src: path.join(__dirname, 'middlewares/index.js'),
      dest: path.join(middlewaresDir, 'index.js')
    },
    {
      src: path.join(__dirname, 'middlewares/generatorId.js'),
      dest: path.join(middlewaresDir, 'generatorId.js')
    },
    {
      src: path.join(__dirname, 'templates/middlewares/crudRouter.js'),
      dest: path.join(middlewaresDir, 'crudRouter.js')
    },
    {
      src: path.join(__dirname, 'templates/middlewares/routeLoader.js'),
      dest: path.join(middlewaresDir, 'routeLoader.js')
    },
    // ModelUtils
    {
      src: path.join(__dirname, 'templates/modelUtils/baseModel.js'),
      dest: path.join(modelUtilsDir, 'baseModel.js')
    },
    {
      src: path.join(__dirname, 'templates/modelUtils/defaultData.js'),
      dest: path.join(modelUtilsDir, 'defaultData.js')
    },
    {
      src: path.join(__dirname, 'templates/modelUtils/modelUtils.js'),
      dest: path.join(modelUtilsDir, 'modelUtils.js')
    },
    // ControllerUtils
    {
      src: path.join(__dirname, 'templates/controllers/conrollersUtils/baseController.js'),
      dest: path.join(controllerUtilsDir, 'baseController.js')
    }
  ];
  
  // Copy each file if it doesn't exist
  for (const file of filesToCopy) {
    if (!fs.existsSync(file.dest)) {
      fs.copyFileSync(file.src, file.dest);
    }
  }
  
  // Create server.js if it doesn't exist
  const serverPath = path.join(outputDir, 'server.js');
  if (!fs.existsSync(serverPath)) {
    const serverTemplate = fs.readFileSync(
      path.join(__dirname, 'templates/server.js'),
      'utf8'
    );
    fs.writeFileSync(serverPath, serverTemplate);
  }
  
  // Create index.js for routes and models if they don't exist
  const routesIndexPath = path.join(outputDir, 'routes/index.js');
  if (!fs.existsSync(routesIndexPath)) {
    const routesIndexTemplate = fs.readFileSync(
      path.join(__dirname, 'templates/routes/index.js'),
      'utf8'
    );
    fs.writeFileSync(routesIndexPath, routesIndexTemplate);
  }
  
  const modelsIndexPath = path.join(outputDir, 'models/index.js');
  if (!fs.existsSync(modelsIndexPath)) {
    const modelsIndexTemplate = fs.readFileSync(
      path.join(__dirname, 'templates/models/index.js'),
      'utf8'
    );
    fs.writeFileSync(modelsIndexPath, modelsIndexTemplate);
  }
}

/**
 * Update the models index.js file to import the new model
 * @param {string} modelName - Name of the model
 * @param {string} outputDir - Output directory path
 */
async function updateModelsIndex(modelName, outputDir) {
  const indexPath = path.join(outputDir, 'models', 'index.js');
  
  if (fs.existsSync(indexPath)) {
    let content = fs.readFileSync(indexPath, 'utf8');
    const capitalizedModelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
    
    // Check if the model is already imported
    if (!content.includes(`import ${capitalizedModelName} from './${capitalizedModelName}Model.js';`)) {
      // Add import statement at the top of the file
      content = content.replace(
        /\/\/ Import models[\s\S]*?(\n)/,
        `// Import models\nimport ${capitalizedModelName} from './${capitalizedModelName}Model.js';\n$1`
      );
      
      fs.writeFileSync(indexPath, content);
    }
  }
}

/**
 * CLI function to generate code from command line
 */
export async function generateFromCLI() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log('Usage:');
    console.log('  node generator.js model <modelName> <fieldsJson> [generateInBackend]');
    console.log('  node generator.js auth [generateInBackend]');
    console.log('Examples:');
    console.log('  node generator.js model task \'[{"name":"title","type":"string","required":true},{"name":"description","type":"text"}]\' true');
    console.log('  node generator.js auth true');
    return;
  }

  const command = args[0];

  try {
    if (command === 'model') {
      if (args.length < 3) {
        console.log('Usage: node generator.js model <modelName> <fieldsJson> [generateInBackend]');
        return;
      }
      
      const modelName = args[1];
      const fields = JSON.parse(args[2]);
      const generateInBackend = args[3] === 'false' ? false : true;
      
      const result = await generateBackendCode(modelName, fields, generateInBackend);
      console.log('✅ Generated files in output directory:');
      console.log(`- Model: ${result.model}`);
      console.log(`- Controller: ${result.controller}`);
      console.log(`- Route: ${result.route}`);
    } 
    else if (command === 'auth') {
      const generateInBackend = args[1] === 'false' ? false : true;
      await generateAuthSystem(generateInBackend);
    }
    else {
      console.log('Unknown command. Use "model" or "auth".');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run CLI if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateFromCLI();
} 