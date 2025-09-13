import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';
import { generateBackendCode } from '../generator/index.js';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Validate the request body for generating code
 */
function validateGeneratorRequest(req, res, next) {
  const { modelName, fields } = req.body;
  
  if (!modelName) {
    return res.status(400).json({ error: 'Model name is required' });
  }
  
  if (!fields || !Array.isArray(fields) || fields.length === 0) {
    return res.status(400).json({ error: 'Fields must be a non-empty array' });
  }
  
  for (const field of fields) {
    if (!field.name || !field.type) {
      return res.status(400).json({ error: 'Each field must have a name and type' });
    }
  }
  
  next();
}

/**
 * @route POST /api/v1/generator
 * @desc Generate backend code based on model definition
 * @access Public
 */
router.post('/', validateGeneratorRequest, async (req, res) => {
  try {
    const { modelName, fields } = req.body;
    
    // Generate the code
    const result = await generateBackendCode(modelName, fields);
    
    // Read the generated files to send back in response
    const modelCode = fs.readFileSync(result.model, 'utf8');
    const controllerCode = fs.readFileSync(result.controller, 'utf8');
    const routeCode = fs.readFileSync(result.route, 'utf8');
    
    res.status(200).json({
      message: 'Code generated successfully',
      modelName,
      modelCode,
      controllerCode,
      routeCode,
      filePaths: result
    });
  } catch (error) {
    console.error('Error generating code:', error);
    res.status(500).json({ error: 'Failed to generate code', details: error.message });
  }
});

/**
 * @route POST /api/v1/generator/download
 * @desc Generate and download backend code as a ZIP file
 * @access Public
 */
router.post('/download', validateGeneratorRequest, async (req, res) => {
  try {
    const { modelName, fields } = req.body;
    
    // Generate the code
    const result = await generateBackendCode(modelName, fields);
    
    // Create a ZIP file
    res.attachment(`${modelName}-files.zip`);
    
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });
    
    // Pipe the archive to the response
    archive.pipe(res);
    
    // Add the generated files to the archive
    archive.file(result.model, { name: `${modelName}Model.js` });
    archive.file(result.controller, { name: `${modelName}Controller.js` });
    archive.file(result.route, { name: `${modelName}Routes.js` });
    
    // Finalize the archive
    await archive.finalize();
  } catch (error) {
    console.error('Error generating ZIP:', error);
    res.status(500).json({ error: 'Failed to generate ZIP file', details: error.message });
  }
});

/**
 * @route GET /api/v1/generator/templates
 * @desc Get all available templates
 * @access Public
 */
router.get('/templates', (req, res) => {
  try {
    const templatesDir = path.join(__dirname, '../generator/templates');
    const templates = fs.readdirSync(templatesDir)
      .filter(file => file.endsWith('.js'))
      .map(file => ({
        name: file.replace('Template.js', ''),
        path: `/api/v1/generator/templates/${file.replace('.js', '')}`
      }));
    
    res.status(200).json({ templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates', details: error.message });
  }
});

/**
 * @route GET /api/v1/generator/templates/:template
 * @desc Get a specific template
 * @access Public
 */
router.get('/templates/:template', (req, res) => {
  try {
    const { template } = req.params;
    const templatePath = path.join(__dirname, `../generator/templates/${template}Template.js`);
    
    if (!fs.existsSync(templatePath)) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    res.status(200).json({ template, content: templateContent });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ error: 'Failed to fetch template', details: error.message });
  }
});

export default router; 