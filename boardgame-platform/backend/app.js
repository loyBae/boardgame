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
//app.use(cors());
app.use(cors({ origin: '*' }))
app.use(bodyParser.json());

// 라우트 연결
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const server = http.createServer(app);
setupSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  //console.log(`✅ 서버 실행 중: http://127.0.0.1:${PORT}`);
  console.log(`✅ 서버 실행 중: http://0.0.0.0:${PORT}`);
  console.log(`🌐 네트워크 접근 가능: http://${getLocalIP()}:${PORT}`);
});

// ✅ 로컬 네트워크 IP 가져오는 함수
function getLocalIP() {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const config of iface) {
      if (config.family === 'IPv4' && !config.internal) {
        return config.address;
      }
    }
  }
  return '127.0.0.1';
}