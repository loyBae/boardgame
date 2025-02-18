// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <Routes>
      {/* 로그인 페이지 */}
      <Route path="/" element={<Login />} />

      {/* 회원가입 페이지 */}
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App
