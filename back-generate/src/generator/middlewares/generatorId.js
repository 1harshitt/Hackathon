/**
 * Generates a unique ID for database records
 * @returns {string} A unique ID string
 */
function generateId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomStr}`;
}

export default generateId; 