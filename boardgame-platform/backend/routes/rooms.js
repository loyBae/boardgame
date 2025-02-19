// 2. routes/rooms.js
const express = require('express');
const pool = require('../db');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// ✅ 1. 방 목록 조회 API
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rooms');
    res.json(result.rows);
  } catch (err) {
    console.error('🚨 방 목록 불러오기 실패:', err);
    res.status(500).json({ error: '방 목록 불러오기 실패' });
  }
});

// ✅ 2. 특정 방 정보 조회 API
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM rooms WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "해당 방을 찾을 수 없습니다." });
    }

    // 현재 방에 있는 사용자 리스트 조회
    const usersResult = await pool.query(
      'SELECT user_id FROM users_in_room WHERE room_id = $1', 
      [id]
    );

    res.json({
      room: result.rows[0],
      users: usersResult.rows.map(row => row.user_id)
    });

  } catch (err) {
    console.error('🚨 방 정보 조회 오류:', err);
    res.status(500).json({ error: "방 정보 불러오기 실패" });
  }
});

// ✅ 3. 방 생성 API
router.post('/', authenticateToken, async (req, res) => {
  const { title, game_type, max_players, password } = req.body;
  const owner_id = req.user.nickname;

  if (!title || !game_type || !max_players) {
    return res.status(400).json({ error: "모든 필드를 입력하세요." });
  }

  try {
    // 🔑 비밀번호가 있다면 해싱해서 저장
    const hashedPassword = password ? bcrypt.hashSync(password, 10) : null;

    // 방 생성
    const result = await pool.query(
      `INSERT INTO rooms (title, game_type, max_players, owner_id, password)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, game_type, max_players, owner_id, hashedPassword]
    );

    const room = result.rows[0];
    console.log("✅ 방 생성 완료:", room);

    // 🔥 방 생성 직후 방장 자동 입장
    await pool.query(
      `INSERT INTO users_in_room (room_id, user_id) VALUES ($1, $2)`,
      [room.id, owner_id]
    );

    // ✅ res.json()은 한 번만 호출
    return res.status(201).json(room);

  } catch (err) {
    console.error('🚨 방 생성 오류:', err);
    return res.status(500).json({ error: '방 생성 실패' });
  }
});

// ✅ 4. 방 나가기 API
router.post('/:id/leave', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.nickname;

  try {
    // 방 나가기 처리
    await pool.query('DELETE FROM users_in_room WHERE room_id = $1 AND user_id = $2', [id, user_id]);

    // 방이 비어 있는지 확인
    const checkRoom = await pool.query(
      'SELECT COUNT(*) FROM users_in_room WHERE room_id = $1',
      [id]
    );

    if (parseInt(checkRoom.rows[0].count) === 0) {
      // 🔥 방이 비었으면 삭제
      await pool.query('DELETE FROM rooms WHERE id = $1', [id]);
      console.log(`🗑 방 ${id}이 삭제되었습니다.`);
    }

    return res.json({ message: '방 나가기 성공' });

  } catch (err) {
    console.error('🚨 방 나가기 오류:', err);
    return res.status(500).json({ error: '방 나가기 실패' });
  }
});

module.exports = router;
