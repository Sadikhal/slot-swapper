import jwt from 'jsonwebtoken';
import { createError } from '../lib/createError.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, 'You Are not authenticated'));
  }

  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) return next(createError(403, 'Token is not valid!'));
    req.user = payload;
    req.userId = payload.id;
    next();
  });
};

