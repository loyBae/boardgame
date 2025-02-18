// src/pages/Rooms.jsx
import { useEffect, useState } from 'react'

function Rooms() {
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/rooms')
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error(err))
  }, [])

  return (
    <div>
      <h1>게임방 목록</h1>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            방ID: {room.id}, 방이름: {room.room_name}, 만든사람: {room.owner_id}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Rooms
