// middleware/auth.js 생성
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: '인증 토큰이 필요합니다.' });

  const token = authHeader.split(' ')[1]; // Bearer <token> 형식
  if (!token) return res.status(401).json({ error: '토큰 형식이 올바르지 않습니다.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: '토큰 검증 실패' });
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
