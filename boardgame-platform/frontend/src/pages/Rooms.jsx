// src/pages/Rooms.jsx
import { useEffect, useState } from 'react';
import CreateRoomModal from '../components/CreateRoomModal';
import { useNavigate, useParams } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_URL;

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/rooms`);
        const data = await res.json();
        setRooms(data);
      } catch (error) {
        console.error('방 목록을 불러오는 중 오류 발생:', error);
      }
    };
    fetchRooms();
  }, [showModal]);

  const enterRoom = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div>
      <h1>게임방 목록</h1>
      <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4">방 만들기</button>
      {showModal && <CreateRoomModal onClose={() => setShowModal(false)} />}

      <ul>
        {rooms.map((room) => (
          <li key={room.id} onClick={() => enterRoom(room.id)} className="cursor-pointer hover:bg-gray-200 p-2 rounded">
            방ID: {room.id}, 방이름: {room.title}, 게임: {room.game_type}, 인원: {room.current_players}/{room.max_players}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Rooms;

export function Room() {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const leaveRoom = async () => {
    try {
      await fetch(`${BASE_URL}/api/rooms/${roomId}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      navigate('/rooms');
    } catch (error) {
      console.error('방 나가기 오류:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">방 {roomId}</h2>
      <button onClick={leaveRoom} className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600">방 나가기</button>
    </div>
  );
}
