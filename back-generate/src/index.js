import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { generateBackendCode } from './generator/index.js';
import archiver from 'archiver';

// Load environment variables
dotenv.config();

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if running in CLI mode
const isCLI = process.argv.includes('--cli');

if (isCLI) {
  // Run CLI
  runCLI();
} else {
  // Run API server
  const startServer = async () => {
    const app = express();
    const PORT = process.env.PORT || 3000;

    // Middleware
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Add a health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({
        status: 'ok',
        message: 'Backend Generator API is running',
        timestamp: new Date().toISOString()
      });
    });

    // Routes
    app.get('/api', (req, res) => {
      res.json({
        message: 'Backend Generator API',
        version: '1.0.0',
        endpoints: [
          {
            path: '/api/generate',
            method: 'POST',
            description: 'Generate backend code based on model definition'
          },
          {
            path: '/api/download',
            method: 'POST',
            description: 'Generate and download backend code as ZIP'
          }
        ]
      });
    });

    // Generate backend code
    app.post('/api/generate', async (req, res) => {
      try {
        const { modelName, fields } = req.body;
        
        // Validate input
        if (!modelName || !fields || !Array.isArray(fields) || fields.length === 0) {
          return res.status(400).json({
            error: 'Invalid input. Please provide modelName and fields array.'
          });
        }
        
        // Generate files
        const result = await generateBackendCode(modelName, fields);
        
        // Read the generated files to send back in response
        const modelCode = fs.readFileSync(result.model, 'utf8');
        const controllerCode = fs.readFileSync(result.controller, 'utf8');
        const routeCode = fs.readFileSync(result.route, 'utf8');
        
        res.json({
          message: 'Files generated successfully',
          modelName,
          results: {
            modelCode,
            controllerCode,
            routeCode,
            filePaths: result
          }
        });
      } catch (error) {
        console.error('Error generating files:', error);
        res.status(500).json({
          error: 'Failed to generate files',
          message: error.message
        });
      }
    });

    // Download backend code as ZIP
    app.post('/api/download', async (req, res) => {
      try {
        const { modelName, fields } = req.body;
        
        // Validate input
        if (!modelName || !fields || !Array.isArray(fields) || fields.length === 0) {
          return res.status(400).json({
            error: 'Invalid input. Please provide modelName and fields array.'
          });
        }
        
        // Generate files
        const result = await generateBackendCode(modelName, fields);
        
        // Create a ZIP file
        res.attachment(`${modelName}-backend.zip`);
        
        const archive = archiver('zip', {
          zlib: { level: 9 } // Maximum compression
        });
        
        // Pipe the archive to the response
        archive.pipe(res);
        
        // Add the output directory to the archive
        const outputDir = path.join(__dirname, '../output');
        archive.directory(outputDir, false);
        
        // Finalize the archive
        await archive.finalize();
      } catch (error) {
        console.error('Error generating ZIP:', error);
        res.status(500).json({
          error: 'Failed to generate ZIP file',
          message: error.message
        });
      }
    });

    // Serve static frontend files
    const publicPath = path.join(__dirname, '../public');
    if (fs.existsSync(publicPath)) {
      console.log(`Serving frontend from ${publicPath}`);
      app.use(express.static(publicPath));
      
      // Serve index.html for any non-API routes
      app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
          res.sendFile(path.join(publicPath, 'index.html'));
        }
      });
    } else {
      const frontendPath = path.join(__dirname, '../../front-generate/dist');
      if (fs.existsSync(frontendPath)) {
        console.log(`Serving frontend from ${frontendPath}`);
        app.use(express.static(frontendPath));
        
        // Serve index.html for any non-API routes
        app.get('*', (req, res) => {
          if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(frontendPath, 'index.html'));
          }
        });
      } else {
        console.log('Frontend build not found. API-only mode enabled.');
      }
    }

    // Start server with error handling for port in use
    const server = app.listen(PORT, () => {
      console.log(`Backend Generator API running on port ${PORT}`);
      console.log(`API documentation available at http://localhost:${PORT}/api`);
      console.log(`Web interface available at http://localhost:${PORT}`);
      console.log('To run in CLI mode, use: node src/index.js --cli');
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Trying port ${PORT + 1}`);
        app.listen(PORT + 1, () => {
          console.log(`Backend Generator API running on port ${PORT + 1}`);
          console.log(`API documentation available at http://localhost:${PORT + 1}/api`);
          console.log(`Web interface available at http://localhost:${PORT + 1}`);
          console.log('To run in CLI mode, use: node src/index.js --cli');
        });
      } else {
        console.error('Error starting server:', err);
      }
    });
  };

  // Start the server
  startServer().catch(error => {
    console.error('Failed to start server:', error);
  });
}

/**
 * Run the CLI interface
 */
async function runCLI() {
  console.log('Backend Generator CLI');
  console.log('=====================');
  console.log('This feature is not yet implemented.');
  console.log('Please use the web interface or API endpoints.');
  process.exit(0);
}

// Export functions for testing
export { generateBackendCode }; 