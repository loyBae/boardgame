// src/components/Register.jsx
import { useState } from 'react';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleRegister = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        // 성공 시, data.userId와 data.message 확인
        setMsg(`회원가입 성공! (유저ID: ${data.userId})`);
      } else {
        // 서버에서 받은 에러 메시지 표시
        setMsg(data.error);
      }
    } catch (error) {
      console.error(error);
      setMsg('회원가입 중 오류가 발생했습니다!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-4 text-2xl font-bold">회원가입</h1>
      <input
        type="text"
        placeholder="아이디"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mb-2 p-2 border border-gray-300 rounded"
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <button
        onClick={handleRegister}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        회원가입
      </button>
      <p className="mt-4 text-red-500">{msg}</p>
    </div>
  );
}

export default Register;
