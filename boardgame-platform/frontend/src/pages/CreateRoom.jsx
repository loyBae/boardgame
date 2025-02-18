// src/pages/CreateRoom.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateRoom() {
  const [roomName, setRoomName] = useState('')
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  const handleCreateRoom = async () => {
    try {
      const token = localStorage.getItem('token') // 로그인 시 저장한 JWT
      const res = await fetch('http://127.0.0.1:5000/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ roomName })
      })
      const data = await res.json()
      if (res.ok) {
        setMsg(`방 생성 성공! (ID: ${data.roomId})`)
        // 생성 후 자동으로 목록 페이지로 이동할 수도 있음
        navigate('/rooms')
      } else {
        setMsg(data.error || '방 생성 실패')
      }
    } catch (err) {
      console.error(err)
      setMsg('에러 발생')
    }
  }

  return (
    <div>
      <h1>게임방 생성</h1>
      <input
        type="text"
        placeholder="방 이름"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button onClick={handleCreateRoom}>생성</button>
      <p>{msg}</p>
    </div>
  )
}

export default CreateRoom
