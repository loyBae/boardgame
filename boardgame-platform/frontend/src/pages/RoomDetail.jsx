import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_URL;

// 📡 Socket.IO 서버에 연결 (백엔드 주소)
const socket = io(`${BASE_URL}`);

export default function RoomDetail() {
    const { id: roomId } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const username = localStorage.getItem("username");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(`🔍 방 정보 요청: /api/rooms/${roomId}`);
        fetch(`${BASE_URL}/api/rooms/${roomId}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    console.error("🚨 방 불러오기 실패:", data.error);
                    return;
                }
                console.log("✅ 방 정보:", data);
                setRoom(data.room);
                setUsers(data.users);
                setLoading(false);
            })
            .catch(err => {
                console.error("🚨 오류 발생:", err);
                setLoading(false);
            });

        // ✅ 소켓 연결 및 방 입장
        console.log("📡 소켓 연결 시도:", { roomId, username });
        socket.emit("joinRoom", { roomId, username });

        socket.on("message", (message) => {
            console.log("📩 받은 메시지:", message);
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.emit("leaveRoom", { roomId, username });
            socket.off("message");
        };
    }, [roomId, username]);

    const sendMessage = () => {
        if (inputMessage.trim() !== "") {
            socket.emit("sendMessage", { roomId, username, message: inputMessage });
            setInputMessage("");
        }
    };

    const leaveRoom = async () => {
        try {
            console.log(`🚪 방 나가기 요청: /api/rooms/${roomId}/leave`);
            const res = await fetch(`${BASE_URL}/api/room/${roomId}/leave`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            if (res.ok) {
                console.log("✅ 방 나가기 성공");
                navigate("/rooms");
            } else {
                console.error("❌ 방 나가기 실패");
            }
        } catch (error) {
            console.error("🚨 방 나가기 중 오류 발생:", error);
        }
    };

    if (loading) return <div>로딩 중...</div>;
    if (!room) return <div>방을 찾을 수 없습니다.</div>;

    return (
        <div className="flex flex-col h-screen p-4">
            <h2 className="text-xl font-bold">{room.title} ({room.game_type})</h2>
            <p>방장: {room.owner_id}</p>

            <h3 className="text-xl mt-4">현재 참여자:</h3>
            <ul className="mb-4">
                {users.map(user => (
                    <li key={user}>{user}</li>
                ))}
            </ul>

            <div className="flex-1 overflow-auto bg-gray-100 p-2 rounded">
                {messages.map((msg, index) => (
                    <p key={index} className={msg.user === username ? "text-blue-500" : "text-gray-700"}>
                        <strong>{msg.user}:</strong> {msg.text}
                    </p>
                ))}
            </div>

            <div className="flex gap-2 mt-2">
                <input
                    type="text"
                    className="p-2 border rounded flex-1"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="메시지 입력..."
                />
                <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded">전송</button>
            </div>

            <button onClick={leaveRoom} className="bg-red-500 text-white p-2 rounded mt-4">방 나가기</button>
        </div>
    );
}
