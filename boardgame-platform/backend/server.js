require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Nodemailer 설정
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'qodlsfuf@gmail.com',
    pass: 'urnw adzp fwmv ivhv'
  }
});


// PostgreSQL 연결
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// JWT 인증 미들웨어 추가
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // 'Bearer <token>' 형식 처리
  if (!token) {
    console.log('🔴 토큰이 없습니다.');
    return res.status(401).json({ error: '토큰이 필요합니다.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('🔴 JWT 검증 실패:', err);
      return res.status(403).json({ error: '토큰이 유효하지 않습니다.' });
    }
    req.user = user;
    next();
  });
};

// 방 만들기

// 방 관리 API 

// 방 생성 API - 생성자 자동 입장.
app.post('/api/rooms', authenticateToken, async (req, res) => {
  const { title, game_type, max_players } = req.body;
  const owner_id = req.user.nickname; // 사용자 닉네임을 owner_id로 사용
  try {
    const newRoom = await pool.query('INSERT INTO rooms (title, game_type, max_players, owner_id) VALUES ($1, $2, $3, $4) RETURNING *', [title, game_type, max_players, owner_id]);
    await pool.query('INSERT INTO users_in_room (room_id, user_id) VALUES ($1, $2)', [newRoom.rows[0].id, owner_id]);
    res.status(201).json(newRoom.rows[0]);
  } catch (error) {
    console.error('방 만들기 오류:', error);
    res.status(500).json({ error: '방 만들기 실패' });
  }
});

// 방 목록 조회 API
app.get('/api/rooms', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rooms ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '방 목록 조회 실패' });
  }
});

// 방 삭제 API
app.delete('/api/rooms/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM rooms WHERE id = $1', [id]);
    res.status(200).json({ message: '방 삭제 성공' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '방 삭제 실패' });
  }
});

//방 나가기 API
app.post('/api/rooms/:id/leave', authenticateToken, async (req, res) => {
  const roomId = req.params.id;
  try {
    await pool.query('DELETE FROM users_in_room WHERE room_id = $1 AND user_id = $2', [roomId, req.user.username]);

    const result = await pool.query('SELECT COUNT(*) FROM users_in_room WHERE room_id = $1', [roomId]);
    const count = parseInt(result.rows[0].count);

    if (count === 0) {
      await pool.query('DELETE FROM rooms WHERE id = $1', [roomId]);
    }

    res.status(200).json({ message: '방에서 나갔습니다.' });
  } catch (error) {
    console.error('방 나가기 오류:', error);
    res.status(500).json({ error: '방 나가기 실패' });
  }
});

// 회원가입 API
app.post('/api/register', async (req, res) => {
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

    const verificationLink = `http://localhost:5000/api/verify?email=${email}`;
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
app.get('/api/verify', async (req, res) => {
  const { email } = req.query;
  try {
    await pool.query('UPDATE users SET email_verified = TRUE WHERE email = $1', [email]);
    res.send('이메일 인증이 완료되었습니다. 이제 로그인할 수 있습니다.');
  } catch (error) {
    res.status(500).send('이메일 인증 실패');
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

// 닉네임 중복 확인 API
app.get('/api/check-nickname', async (req, res) => {
  const { nickname } = req.query;
  try {
    const result = await pool.query('SELECT * FROM users WHERE nickname = $1', [nickname]);
    if (result.rows.length > 0) {
      return res.status(409).json({ error: '이미 사용 중인 닉네임입니다.' });
    } else {
      res.status(200).json({ message: '사용 가능한 닉네임입니다.' });
    }
  } catch (error) {
    res.status(500).json({ error: '닉네임 확인 중 오류가 발생했습니다.' });
  }
});

// 로그인시 닉네임 불러오기 APIapp.get('/api/')



// 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://127.0.0.1:${PORT}`);
});
