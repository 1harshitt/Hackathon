import inquirer from 'inquirer';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { generateBasicFiles } from './generator/basicGenerator.js';
import { generateAdvancedProject } from './generator/advancedGenerator.js';

/**
 * Main CLI function
 */
export async function runCLI() {
  console.log(chalk.blue.bold('\n=== Backend Code Generator ===\n'));
  
  // Ask for generator type
  const { generatorType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'generatorType',
      message: 'What type of generator would you like to use?',
      choices: [
        { name: 'Basic (Simple CRUD)', value: 'basic' },
        { name: 'Advanced (With validation, pagination, etc.)', value: 'advanced' },
        { name: 'Full Project (Multiple models with relationships)', value: 'project' }
      ]
    }
  ]);
  
  if (generatorType === 'basic') {
    await runBasicGenerator();
  } else if (generatorType === 'advanced') {
    await runAdvancedGenerator();
  } else {
    await runProjectGenerator();
  }
}

/**
 * Run the basic generator
 */
async function runBasicGenerator() {
  console.log(chalk.green('\n=== Basic Generator ===\n'));
  
  // Get model details
  const modelDetails = await getModelDetails();
  
  console.log(chalk.yellow('\nGenerating basic files...\n'));
  
  try {
    const results = generateBasicFiles(modelDetails);
    
    console.log(chalk.green('\nFiles generated successfully:'));
    console.log(chalk.green(`Model: ${results.model}`));
    console.log(chalk.green(`Controller: ${results.controller}`));
    console.log(chalk.green(`Routes: ${results.routes}`));
  } catch (error) {
    console.error(chalk.red('\nError generating files:'), error);
  }
}

/**
 * Run the advanced generator
 */
async function runAdvancedGenerator() {
  console.log(chalk.green('\n=== Advanced Generator ===\n'));
  
  // Get model details
  const modelDetails = await getModelDetails();
  
  console.log(chalk.yellow('\nGenerating advanced files...\n'));
  
  try {
    const results = generateAdvancedProject([modelDetails]);
    
    console.log(chalk.green('\nFiles generated successfully:'));
    console.log(chalk.green(`Model: ${results.models[0]}`));
    console.log(chalk.green(`Controller: ${results.controllers[0]}`));
    console.log(chalk.green(`Middleware: ${results.middleware[0]}`));
    console.log(chalk.green(`Routes: ${results.routes[0]}`));
    console.log(chalk.green(`Database Config: ${results.dbConfig}`));
    console.log(chalk.green(`Server: ${results.server}`));
  } catch (error) {
    console.error(chalk.red('\nError generating files:'), error);
  }
}

/**
 * Run the full project generator
 */
async function runProjectGenerator() {
  console.log(chalk.green('\n=== Full Project Generator ===\n'));
  
  // Get number of models
  const { modelCount } = await inquirer.prompt([
    {
      type: 'number',
      name: 'modelCount',
      message: 'How many models do you want to create?',
      default: 2,
      validate: value => value > 0 ? true : 'Please enter a number greater than 0'
    }
  ]);
  
  const modelConfigs = [];
  
  // Get details for each model
  for (let i = 0; i < modelCount; i++) {
    console.log(chalk.blue(`\n--- Model ${i + 1} ---`));
    const modelDetails = await getModelDetails();
    modelConfigs.push(modelDetails);
  }
  
  console.log(chalk.yellow('\nGenerating project files...\n'));
  
  try {
    const results = generateAdvancedProject(modelConfigs);
    
    console.log(chalk.green('\nFiles generated successfully:'));
    console.log(chalk.green(`Models: ${results.models.length} files`));
    console.log(chalk.green(`Controllers: ${results.controllers.length} files`));
    console.log(chalk.green(`Middleware: ${results.middleware.length} files`));
    console.log(chalk.green(`Routes: ${results.routes.length} files`));
    console.log(chalk.green(`Database Config: ${results.dbConfig}`));
    console.log(chalk.green(`Server: ${results.server}`));
  } catch (error) {
    console.error(chalk.red('\nError generating files:'), error);
  }
}

/**
 * Get model details from user input
 */
async function getModelDetails() {
  // Get model name
  const { modelName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'modelName',
      message: 'Enter the model name (singular, e.g. user, product):',
      validate: input => input.trim() !== '' ? true : 'Model name is required'
    }
  ]);
  
  // Get fields
  const fields = [];
  let addMoreFields = true;
  
  while (addMoreFields) {
    // Get field details
    const field = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Field name:',
        validate: input => input.trim() !== '' ? true : 'Field name is required'
      },
      {
        type: 'list',
        name: 'type',
        message: 'Field type:',
        choices: ['STRING', 'INTEGER', 'FLOAT', 'BOOLEAN', 'TEXT', 'DATE', 'ENUM', 'JSON']
      },
      {
        type: 'confirm',
        name: 'required',
        message: 'Is this field required?',
        default: false
      },
      {
        type: 'confirm',
        name: 'unique',
        message: 'Should this field be unique?',
        default: false
      }
    ]);
    
    // For ENUM type, get values
    if (field.type === 'ENUM') {
      const { enumValues } = await inquirer.prompt([
        {
          type: 'input',
          name: 'enumValues',
          message: 'Enter enum values (comma-separated):',
          validate: input => input.trim() !== '' ? true : 'At least one enum value is required'
        }
      ]);
      
      field.enumValues = enumValues.split(',').map(value => value.trim());
    }
    
    // Add validation
    const { addValidation } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'addValidation',
        message: 'Add validation for this field?',
        default: false
      }
    ]);
    
    if (addValidation) {
      field.validation = await getFieldValidation(field.type);
    }
    
    // Add field to array
    fields.push(field);
    
    // Ask if user wants to add more fields
    const { addMore } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'addMore',
        message: 'Add another field?',
        default: true
      }
    ]);
    
    addMoreFields = addMore;
  }
  
  return {
    modelName,
    fields
  };
}

/**
 * Get field validation based on field type
 */
async function getFieldValidation(fieldType) {
  const validation = {};
  
  switch (fieldType) {
    case 'STRING':
    case 'TEXT':
      const { stringValidation } = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'stringValidation',
          message: 'Select string validations:',
          choices: [
            { name: 'Min Length', value: 'min' },
            { name: 'Max Length', value: 'max' },
            { name: 'Email Format', value: 'isEmail' },
            { name: 'URL Format', value: 'isUrl' }
          ]
        }
      ]);
      
      for (const validationType of stringValidation) {
        if (validationType === 'min' || validationType === 'max') {
          const { value } = await inquirer.prompt([
            {
              type: 'number',
              name: 'value',
              message: `Enter ${validationType} length:`,
              validate: value => value > 0 ? true : 'Please enter a number greater than 0'
            }
          ]);
          
          validation[validationType] = value;
        } else {
          validation[validationType] = true;
        }
      }
      break;
      
    case 'INTEGER':
    case 'FLOAT':
      const { numberValidation } = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'numberValidation',
          message: 'Select number validations:',
          choices: [
            { name: 'Min Value', value: 'min' },
            { name: 'Max Value', value: 'max' }
          ]
        }
      ]);
      
      for (const validationType of numberValidation) {
        const { value } = await inquirer.prompt([
          {
            type: 'number',
            name: 'value',
            message: `Enter ${validationType} value:`
          }
        ]);
        
        validation[validationType] = value;
      }
      break;
      
    case 'DATE':
      const { dateValidation } = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'dateValidation',
          message: 'Select date validations:',
          choices: [
            { name: 'Future Date Only', value: 'isAfter' },
            { name: 'Past Date Only', value: 'isBefore' }
          ]
        }
      ]);
      
      for (const validationType of dateValidation) {
        if (validationType === 'isAfter') {
          validation[validationType] = new Date().toISOString().split('T')[0]; // Today's date
        } else if (validationType === 'isBefore') {
          validation[validationType] = new Date().toISOString().split('T')[0]; // Today's date
        }
      }
      break;
  }
  
  // Add custom validation message
  const { addCustomMessage } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'addCustomMessage',
      message: 'Add custom validation message?',
      default: false
    }
  ]);
  
  if (addCustomMessage) {
    const { message } = await inquirer.prompt([
      {
        type: 'input',
        name: 'message',
        message: 'Enter custom validation message:',
        validate: input => input.trim() !== '' ? true : 'Message is required'
      }
    ]);
    
    validation.msg = message;
  }
  
  return validation;
}

// Run CLI if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCLI();
} 