const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production';

// Generate JWT token (longer expiry since no refresh)
exports.generateToken = (payload) => {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' }); // 24 hour expiry
  return token;
};

// Verify JWT middleware
exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Access token required' });
      return;
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired, please login again' });
      return;
    }
    
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
};