// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Navbar from './components/Navbar'
import Register from './pages/Register';
import Rooms from './pages/Rooms';
import CreateRoom from './pages/CreateRoom';

function App() {
  return (
    // BrowserRouter로 전체를 감싼다
    <>
    
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/create-room" element={<CreateRoom />} />
      </Routes>
    </>
  );
}

export default App; 