import jwt from "jsonwebtoken"
import getValue from '../utils/extractValueFromHeaderKey.js'

const verifyEmployee = function(req, res, next) {
  let token = req.header('Cookie');
  token = getValue(token, 'employee-token');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    req.username = decoded.username;
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

const verifyToken = function(req, res, next) {
  let token = req.header('Cookie');
  token = getValue(token, 'token');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    req.username = decoded.username;
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export { verifyToken, verifyEmployee }