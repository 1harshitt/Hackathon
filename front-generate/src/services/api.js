import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const generateBasicCode = async (modelData) => {
  try {
    const response = await api.post('/generate', modelData);
    return response.data;
  } catch (error) {
    console.error('Error generating code:', error);
    throw error;
  }
};

export const generateAdvancedCode = async (modelData) => {
  // Now just uses the same endpoint as basic code
  return generateBasicCode(modelData);
};

export const generateProject = async (models) => {
  try {
    // For project generation, we'll generate code for the first model
    // since we're simplifying to only support single model generation
    if (Array.isArray(models) && models.length > 0) {
      const response = await api.post('/generate', models[0]);
      return response.data;
    }
    throw new Error('No models provided');
  } catch (error) {
    console.error('Error generating project:', error);
    throw error;
  }
};

export const downloadZip = async (modelData, type = 'basic') => {
  try {
    let requestData = modelData;
    
    // If it's a project (array of models), use the first model
    if (type === 'project' && Array.isArray(modelData) && modelData.length > 0) {
      requestData = modelData[0];
    }
    
    const response = await api.post('/download', requestData, {
      responseType: 'blob'
    });
    
    // Create a download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${requestData.modelName}-backend.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return true;
  } catch (error) {
    console.error('Error downloading files:', error);
    throw error;
  }
};

export default api; 