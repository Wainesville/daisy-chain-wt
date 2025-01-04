const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    console.error('No Authorization header found'); // Use console.error instead
    return res.status(403).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.replace('Bearer ', '');
  // console.log('Token received:', token); // Remove this line

  if (!token) {
    console.error('No token found after replacing Bearer'); // Use console.error instead
    return res.status(403).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Token decoded:', decoded); // Remove this line
    req.user = { id: decoded.userId }; // Ensure the user object has the correct id
    next();
  } catch (ex) {
    console.error('Invalid token:', ex.message); // Use console.error instead
    res.status(403).json({ error: 'Invalid token.' });
  }
};

module.exports = authenticate;