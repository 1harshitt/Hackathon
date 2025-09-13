import inquirer from 'inquirer';
import chalk from 'chalk';
import { generateBasicFiles } from '../generator/basicGenerator.js';
import { generateAdvancedProject } from '../generator/advancedGenerator.js';

async function cliGenerator() {
  console.log(chalk.blue('==================================='));
  console.log(chalk.blue('   Backend Code Generator CLI'));
  console.log(chalk.blue('==================================='));

  try {
    // Select generator type
    const { generatorType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'generatorType',
        message: 'Select generator type:',
        choices: [
          { name: 'Basic (Model, Controller, Routes)', value: 'basic' },
          { name: 'Advanced (Full CRUD with validation)', value: 'advanced' },
          { name: 'Project (Multiple models with relationships)', value: 'project' }
        ]
      }
    ]);

    if (generatorType === 'basic' || generatorType === 'advanced') {
      await generateSingleModel(generatorType);
    } else if (generatorType === 'project') {
      await generateProject();
    }

  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

async function generateSingleModel(type) {
  try {
    const { modelName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'modelName',
        message: 'Enter model name (singular, PascalCase):',
        validate: input => input ? true : 'Model name is required'
      }
    ]);

    // Collect fields
    const fields = await collectFields();

    // Generate code
    console.log(chalk.yellow('\nGenerating code...'));
    
    if (type === 'basic') {
      const result = await generateBasicFiles({ modelName, fields });
      displayResults(result);
    } else {
      const result = await generateAdvancedProject([{ modelName, fields }]);
      displayResults(result);
    }

  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
  }
}


async function generateProject() {
  try {
    const models = [];
    let addMore = true;

    console.log(chalk.yellow('\nLet\'s define your models:'));

    while (addMore) {
      const { modelName } = await inquirer.prompt([
        {
          type: 'input',
          name: 'modelName',
          message: 'Enter model name (singular, PascalCase):',
          validate: input => input ? true : 'Model name is required'
        }
      ]);

      const fields = await collectFields();

      models.push({ modelName, fields });

      const { continue: shouldContinue } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'continue',
          message: 'Add another model?',
          default: false
        }
      ]);

      addMore = shouldContinue;
    }

    console.log(chalk.yellow('\nGenerating project...'));
    const result = await generateAdvancedProject(models);
    displayResults(result);

  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
  }
}

async function collectFields() {
  const fields = [];
  let addMore = true;

  console.log(chalk.yellow('\nDefine fields for your model:'));

  while (addMore) {
    const field = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Field name:',
        validate: input => input ? true : 'Field name is required'
      },
      {
        type: 'list',
        name: 'type',
        message: 'Field type:',
        choices: [
          'STRING',
          'TEXT',
          'INTEGER',
          'FLOAT',
          'BOOLEAN',
          'DATE',
          'JSON',
          'UUID',
          'ENUM'
        ]
      },
      {
        type: 'input',
        name: 'enumValues',
        message: 'Enter enum values (comma-separated):',
        when: answers => answers.type === 'ENUM',
        validate: input => input ? true : 'Enum values are required'
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
        message: 'Is this field unique?',
        default: false
      }
    ]);

    // Process enum values if needed
    if (field.type === 'ENUM') {
      field.values = field.enumValues.split(',').map(val => val.trim());
    }

    // Add field to list
    fields.push(field);

    // Ask if user wants to add more fields
    const { continue: shouldContinue } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continue',
        message: 'Add another field?',
        default: true
      }
    ]);

    addMore = shouldContinue;
  }

  return fields;
}

/**
 * Display generation results
 */
function displayResults(results) {
  console.log(chalk.green('\n✅ Code generation completed!'));
  console.log(chalk.yellow('Generated files:'));
  
  results.forEach(result => {
    console.log(`- ${chalk.cyan(result.path)}`);
  });
  
  console.log(chalk.blue('\nThank you for using the Backend Code Generator!'));
}

export default cliGenerator; 