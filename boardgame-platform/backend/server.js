require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL 연결
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// 회원가입 API
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    // 비밀번호 해싱
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // DB 저장
    const result = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id',
      [username, hashedPassword]
    );

    res.status(201).json({
      userId: result.rows[0].id,
      message: '회원가입 성공!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '회원가입 실패' });
  }
});

// 로그인 API
app.post('/api/login', async (req, res) => {
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

    // 3) JWT 발급
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

// 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://127.0.0.1:${PORT}`);
});
