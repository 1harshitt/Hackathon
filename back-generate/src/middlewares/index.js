import jwt from 'jsonwebtoken';


export default function authenticateUser(req, res, next) {
  // This is a simplified authentication middleware
  // In a real application, you would validate JWT tokens, check permissions, etc.
  
  // For generated code, we'll make it a passthrough middleware
  // but with proper structure so it can be replaced with real authentication later
  
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (process.env.NODE_ENV === 'development' || process.env.BYPASS_AUTH === 'true') {
    // Skip authentication in development mode
    console.log('⚠️ Authentication bypassed in development mode');
    return next();
  }
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token (using a dummy secret in this template)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Add user to request object
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
} 