import Joi from 'joi';
import { Op } from 'sequelize';
import Document from '../models/documentModel.js';
import fileHandler from '../utils/fileHandler.js';
import createBaseController from './conrollersUtils/baseController.js';
import responseHandler from '../utils/responseHandler.js';

const validationSchemas = {
    create: Joi.object({
        title: Joi.string().required(),
        file: Joi.any().required()
    }),
    update: Joi.object({
        title: Joi.string()
    })
};

// Custom upload handler to handle file upload
const uploadHandler = async (req, res) => {
    try {
        // Validate if file exists in request
        if (!req.files || !req.files.file) {
            return responseHandler.error(res, 'No file uploaded', 400);
        }

        const file = req.files.file;
        const { title } = req.body;

        // Validate file
        fileHandler.validateFile(file);

        // Save file and get file info
        const { fileName, filePath, fileType, fileSize } = await fileHandler.saveFile(file);

        // Create document record in database
        const document = await Document.create({
            title,
            file_name: fileName,
            file_path: filePath,
            file_type: fileType,
            file_size: fileSize,
            uploaded_by: 'system',
            created_by: 'system'
        });

        return responseHandler.success(res, 'Document uploaded successfully', document);
    } catch (error) {
        return responseHandler.error(res, error.message);
    }
};

const hooks = {
    beforeCreate: async (data) => {
        // Title uniqueness check
        const titleExists = await Document.findOne({ where: { title: data.title } });
        if (titleExists) throw new Error('Document with this title already exists');
        return data;
    },
    beforeUpdate: async (data) => {
        // If title is being updated, check for uniqueness
        if (data.title) {
            const titleExists = await Document.findOne({ 
                where: { 
                    title: data.title, 
                    id: { [Op.ne]: data.id } 
                } 
            });
            if (titleExists) throw new Error('Document with this title already exists');
        }
        return data;
    },
    beforeDelete: async (id) => {
        // Get document to delete its file
        const document = await Document.findByPk(id);
        if (document?.file_path) {
            await fileHandler.deleteFile(document.file_path);
        }
    }
};

const { validators, handlers, crud } = createBaseController(Document, validationSchemas, hooks);

// Export both standard and custom handlers
export { validators, handlers, crud, uploadHandler };