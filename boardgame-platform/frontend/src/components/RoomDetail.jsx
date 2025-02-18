import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function RoomDetail() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/rooms/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setRoom(data))
      .catch((err) => console.error('방 정보 불러오기 실패:', err));
  }, [id, token]);

  const leaveRoom = async () => {
    try {
      await fetch(`http://127.0.0.1:5000/api/rooms/${id}/leave`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      navigate('/rooms');
    } catch (err) {
      console.error('방 나가기 실패:', err);
    }
  };

  if (!room) return <div>로딩 중...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{room.title} 방</h1>
      <p>게임 종류: {room.game_type}</p>
      <p>최대 인원: {room.max_players}</p>
      <p>현재 인원: {room.current_players || 1}</p>
      <button onClick={leaveRoom} className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600">방 나가기</button>
    </div>
  );
}
