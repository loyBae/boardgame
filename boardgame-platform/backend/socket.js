// 4. socket.js 생성
const { Server } = require("socket.io"); // Socket.IO 서버 기능 가져오기

/**
 * 🔌 Socket.IO를 설정하고 서버와 연결하는 함수
 * @param {Object} server - Express 서버 객체
 */
function setupSocket(server) {
    // 새로운 Socket.IO 서버 생성
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", // 프론트엔드 도메인 허용 (CORS 설정)
            methods: ["GET", "POST"]
        }
    });

    // 방 정보를 저장할 객체 (각 방에 접속한 사용자 목록 저장)
    const rooms = {};

    // ✅ 사용자가 Socket.IO 서버에 연결되었을 때 실행됨
    io.on("connection", (socket) => {
        console.log("🔵 사용자 연결됨:", socket.id); // 연결된 사용자 ID 출력

        /**
         * 🔹 사용자가 특정 방에 입장할 때 실행
         * @param {Object} data - 방 ID와 사용자 이름
         */
        socket.on("joinRoom", ({ roomId, username }) => {
            socket.join(roomId); // 사용자를 해당 방에 추가
            console.log(`🔹 ${username} 님이 ${roomId} 방에 입장`);

            // 방 목록에 사용자가 없으면 새 배열 생성
            if (!rooms[roomId]) {
                rooms[roomId] = [];
            }
            rooms[roomId].push(username); // 사용자 추가

            // 방에 있는 모든 사용자에게 입장 메시지 전송
            io.to(roomId).emit("message", { user: "system", text: `${username} 님이 입장했습니다.` });
        });

        /**
         * 📨 사용자가 메시지를 보낼 때 실행
         * @param {Object} data - 방 ID, 사용자 이름, 메시지 내용
         */
        socket.on("sendMessage", ({ roomId, username, message }) => {
            console.log(`📩 메시지: ${username} (${roomId}): ${message}`);

            // 방에 있는 모든 사용자에게 메시지 전송
            io.to(roomId).emit("message", { user: username, text: message });
        });

        /**
         * 🔻 사용자가 방을 나갈 때 실행
         * @param {Object} data - 방 ID와 사용자 이름
         */
        socket.on("leaveRoom", ({ roomId, username }) => {
            socket.leave(roomId); // 방에서 사용자 제거
            console.log(`🔻 ${username} 님이 ${roomId} 방을 나갔습니다.`);

            // 방 목록에서 해당 사용자 삭제
            rooms[roomId] = rooms[roomId]?.filter(user => user !== username);

            // 방에 남아있는 사용자들에게 메시지 전송
            io.to(roomId).emit("message", { user: "system", text: `${username} 님이 나갔습니다.` });
        });

        // 🚫 사용자가 연결을 종료했을 때 실행
        socket.on("disconnect", () => {
            console.log("❌ 사용자 연결 종료:", socket.id);
        });
    });
}

// `setupSocket` 함수를 내보내기 (app.js에서 사용 가능)
module.exports = setupSocket;
