import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function CreateRoomModal({ onClose }) {
    const [selectedGame, setSelectedGame] = useState('');
    const [form, setForm] = useState({ title: '', maxPlayers: 4, password: '' });
    const token = localStorage.getItem('token');
    const navigate = useNavigate(); // 라우터 이동 함수

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://127.0.0.1:5000/api/rooms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                 },
                body: JSON.stringify({ ...form, game_type: selectedGame })
            });
            if (res.ok) {
                const room = await res.json();
                alert(`${selectedGame} 방 생성 완료!`);
                onClose();
                navigate(`/rooms/${room.id}`); // 방 생성 후 자동 이동
            } else {
                alert('방 생성 실패함');
            }
        } catch (error) {
            alert('에러 발생: ' + error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                {!selectedGame ? (
                    <>
                        <h2 className="text-xl font-bold mb-4">게임 선택</h2>
                        <button onClick={() => setSelectedGame('splendor')} className="p-2 bg-green-500 text-white rounded mb-2 w-full">스플렌더</button>
                        <button onClick={onClose} className="bg-gray-400 text-white p-2 rounded hover:bg-gray-500 w-full">취소</button>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-bold mb-4">{selectedGame} 방 만들기</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                            <input name="title" placeholder="방 제목" className="p-2 border rounded" value={form.title} onChange={handleChange} required />
                            <input name="maxPlayers" type="number" placeholder="최대 인원 (2~4)" className="p-2 border rounded" value={form.maxPlayers} onChange={handleChange} min="2" max="4" required />
                            <input name="password" type="password" placeholder="비밀번호 (선택)" className="p-2 border rounded" value={form.password} onChange={handleChange} />
                            <div className="flex gap-2 mt-4">
                                <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">방 만들기</button>
                                <button onClick={onClose} className="bg-gray-400 text-white p-2 rounded hover:bg-gray-500">취소</button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}