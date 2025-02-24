// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Rooms from './pages/Rooms';
import RoomDetail from './pages/RoomDetail'; // 수정: RoomDetail 추가
import GameList from './pages/gameList';
import CreateRoomModal from "./components/CreateRoomModal";
import GameListModal from './pages/gameListModal';

function App() {
  return (
    
      <>
        <Navbar /> {/* 네비게이션 추가 */}
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/room/:id" element={<RoomDetail />} /> {/* 수정: `room/:id` → `rooms/:id` */}
          <Route path="/create-room" element={<CreateRoomModal />} />
          <Route path="/gameList" element={<GameList />} />
          <Route path="/gameListModal" element={<GameListModal />} />
        </Routes>
      </>
   
  );
}

export default App;
