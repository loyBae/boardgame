// 2. routes/rooms.js 생성
const express = require('express');
const pool = require('../db');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');


// 방 목록 조회 API
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rooms');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: '방 목록 불러오기 실패' });
  }
});

// 방 생성 API
router.post('/', authenticateToken, async (req, res) => {
  const { title, game_type, max_players, password } = req.body;
  const owner_id = req.user.nickname;

  try {
    const result = await pool.query(
      `INSERT INTO rooms (title, game_type, max_players, owner_id, password)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, game_type, max_players, owner_id, password]
    );


    await pool.query(
      `INSERT INTO users_in_room (room_id, user_id) VALUES ($1, $2)`,
      [result.rows[0].id, owner_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('방 생성 오류:', err);
    res.status(500).json({ error: '방 생성 실패' });
  }
});

// 방 나가기 API
router.post('/:id/leave', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.nickname;

  try {
    await pool.query('DELETE FROM users_in_room WHERE room_id = $1 AND user_id = $2', [id, user_id]);
    res.json({ message: '방 나가기 성공' });
  } catch (err) {
    console.error('방 나가기 오류:', error);
    res.status(500).json({ error: '방 나가기 실패' });
  }
});

module.exports = router;
