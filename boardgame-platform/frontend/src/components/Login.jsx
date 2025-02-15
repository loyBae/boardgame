// src/components/Login.jsx
import { useState } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(`${data.message} (토큰: ${data.token})`);
        // 토큰 로컬 스토리지 저장
        localStorage.setItem('token', data.token);
      } else {
        setMsg(data.error);
      }
    } catch (err) {
      console.error(err);
      setMsg('로그인 실패!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-4 text-2xl font-bold">로그인</h1>
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
        onClick={handleLogin}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        로그인
      </button>
      <p className="mt-4 text-red-500">{msg}</p>
    </div>
  );
}

export default Login;
