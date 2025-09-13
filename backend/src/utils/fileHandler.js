import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supported file types and their mime types
export const SUPPORTED_FILE_TYPES = {
    'application/pdf': 'pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'text/plain': 'txt'
};

// Max file size (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

class FileHandler {
    constructor() {
        this.uploadDir = path.join(__dirname, '../../../uploads');
        this.ensureUploadDirectory();
    }

    ensureUploadDirectory() {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    validateFile(file) {
        // Check if file exists
        if (!file) {
            throw new Error('No file uploaded');
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            throw new Error('File size exceeds limit of 5MB');
        }

        // Check file type
        if (!SUPPORTED_FILE_TYPES[file.mimetype]) {
            throw new Error('File type not supported. Only PDF, DOCX, and TXT files are allowed');
        }

        return true;
    }

    async saveFile(file) {
        try {
            const extension = SUPPORTED_FILE_TYPES[file.mimetype];
            const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${extension}`;
            const filePath = path.join(this.uploadDir, fileName);
            
            // Move the file to upload directory
            await file.mv(filePath);

            return {
                fileName,
                filePath: `/uploads/${fileName}`,
                fileType: extension,
                fileSize: file.size
            };
        } catch (error) {
            throw new Error(`Error saving file: ${error.message}`);
        }
    }

    deleteFile(filePath) {
        try {
            const absolutePath = path.join(__dirname, '../../../', filePath.replace(/^\//, ''));
            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
            }
        } catch (error) {
            throw new Error(`Error deleting file: ${error.message}`);
        }
    }
}

export default new FileHandler();