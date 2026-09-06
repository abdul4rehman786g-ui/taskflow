// backend/utils/generateToken.js
import jwt from 'jsonwebtoken';

export const generateToken = (res, userId) => {
  const secret = process.env.JWT_SECRET || 'taskflow_dev_jwt_secret_key_123456';
  const token = jwt.sign({ id: userId }, secret, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};
