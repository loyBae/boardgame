// src/components/Navbar.jsx
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={{ background: '#ddd', padding: '8px' }}>
      <Link to="/">로그인</Link> |{' '}
      <Link to="/register">회원가입</Link> |{' '}
      <Link to="/rooms">게임방 목록</Link> |{' '}
    </nav>
  )
}

export default Navbar
