import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_URL;

export default function CreateRoomModal({ onClose }) {
    const [selectedGame, setSelectedGame] = useState('');
    const [form, setForm] = useState({ title: '', maxPlayers: 4, password: '' });
    const token = localStorage.getItem('token');
    const navigate = useNavigate(); // 페이지 이동을 위한 라우터

    // 입력 필드 값 변경 핸들러
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    // 방 생성 요청 함수
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        console.log("📡 방 생성 요청:", JSON.stringify({ ...form, game_type: selectedGame }));

        try {
            const res = await fetch(`${BASE_URL}/api/rooms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: form.title,
                    max_players: form.maxPlayers,
                    password: form.password,
                    game_type: selectedGame
                })
            });

            const room = await res.json();
            console.log("✅ 방 생성 응답:", room);

            if (res.ok) {
                alert(`${selectedGame} 방 생성 완료!`);
                onClose(); // 모달 닫기
                navigate(`/room/${room.id}`); // 생성된 방으로 이동
            } else {
                alert(`방 생성 실패: ${room.error || '알 수 없는 오류 발생'}`);
            }
        } catch (error) {
            console.error("❌ 방 생성 중 오류:", error);
            alert('에러 발생: ' + error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                {!selectedGame ? (
                    <>
                        <h2 className="text-xl font-bold mb-4">🎮 게임 선택</h2>
                        <button onClick={() => setSelectedGame('splendor')} className="p-2 bg-green-500 text-white rounded mb-2 w-full">
                            스플렌더
                        </button>
                        <button onClick={onClose} className="bg-gray-400 text-white p-2 rounded hover:bg-gray-500 w-full">
                            취소
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-bold mb-4">🛠 {selectedGame} 방 만들기</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                            <input 
                                name="title" 
                                placeholder="방 제목" 
                                className="p-2 border rounded" 
                                value={form.title} 
                                onChange={handleChange} 
                                required 
                            />
                            <input 
                                name="maxPlayers" 
                                type="number" 
                                placeholder="최대 인원 (2~4)" 
                                className="p-2 border rounded" 
                                value={form.maxPlayers} 
                                onChange={handleChange} 
                                min="2" 
                                max="4" 
                                required 
                            />
                            <input 
                                name="password" 
                                type="password" 
                                placeholder="비밀번호 (선택)" 
                                className="p-2 border rounded" 
                                value={form.password} 
                                onChange={handleChange} 
                            />
                            <div className="flex gap-2 mt-4">
                                <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                                    방 만들기
                                </button>
                                <button onClick={() => setSelectedGame('')} className="bg-gray-400 text-white p-2 rounded hover:bg-gray-500">
                                    이전으로
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
