// 5. app.js 생성
const express = require('express');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const db = require('./db');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const setupSocket = require('./socket');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 라우트 연결
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

const server = http.createServer(app);
setupSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://127.0.0.1:${PORT}`);
});
