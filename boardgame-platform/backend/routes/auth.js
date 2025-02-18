// 3. routes/auth.js 생성
const express = require('express');
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
// Nodemailer 설정
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'qodlsfuf@gmail.com',
    pass: 'urnw adzp fwmv ivhv'
  }
});

const router = express.Router();
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      // 1) 유저 조회
      const userResult = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );
      if (userResult.rows.length === 0) {
        return res.status(400).json({ error: '사용자를 찾을 수 없습니다.' });
      }
  
      const user = userResult.rows[0];
      // 2) 비밀번호 검증
      const isMatch = bcrypt.compareSync(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
      }
  
      // 3) 이메일 인증 여부 검증
      if (!user.email_verified) return res.status(403).json({ error: '이메일 인증이 필요합니다.' });
  
      // 4) JWT 발급
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // 1시간 유효
      );
  
      res.json({ message: '로그인 성공!', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '로그인 실패' });
    }
  });

router.post('/register', async (req, res) => {
  const { username, password, nickname, email, gender } = req.body;
  if (!username || !password || !nickname || !email || !gender) {
    return res.status(400).json({ error: '모든 필수 항목을 입력해야 합니다.' });
  }

  try {
    const nickCheck = await pool.query('SELECT * FROM users WHERE nickname = $1', [nickname]);
    if (nickCheck.rows.length > 0) {
      return res.status(409).json({ error: '이미 사용 중인 닉네임입니다.' });
    }
    

    const hashedPassword = bcrypt.hashSync(password, 10);
    await pool.query(
      'INSERT INTO users (nickname, username, password_hash, email, gender, email_verified) VALUES ($1, $2, $3, $4, $5, $6)',
      [nickname, username, hashedPassword, email, gender, false]
    );

    const verificationLink = `http://localhost:5000/api/auth/verify?email=${email}`;
    await transporter.sendMail({
      from: 'qodlsfuf@gmail.com',
      to: email,
      subject: '이메일 인증',
      text: `아래 링크를 클릭하여 이메일 인증을 완료하세요: ${verificationLink}`
    });

    res.status(201).json({ message: '회원가입 성공! 이메일 인증을 완료해주세요.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '회원가입 실패' });
  }
});
// 이메일 인증 API
router.get('/verify', async (req, res) => {
  const { email } = req.query;
  try {
    await pool.query('UPDATE users SET email_verified = TRUE WHERE email = $1', [email]);
    res.send('이메일 인증이 완료되었습니다. 이제 로그인할 수 있습니다.');
  } catch (error) {
    res.status(500).send('이메일 인증 실패');
  }
});

// 로그인 API

// 닉네임 중복 확인 API
router.get('/check-nickname', async (req, res) => {
  const { nickname } = req.query;
  try {
    const result = await pool.query('SELECT * FROM users WHERE nickname = $1', [nickname]);
    if (result.rows.length > 0) {
      return res.status(409).json({ error: '이미 사용 중인 닉네임입니다.' });
    } else {
      res.status(200).json({ message: '사용 가능한 닉네임입니다.' });
    }
  } catch (error) {
    console.error('닉네임 중복 확인 오류:', error)
    res.status(500).json({ error: '닉네임 확인 중 오류가 발생했습니다.' });
  }
});

module.exports = router;