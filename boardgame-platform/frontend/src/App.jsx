// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Navbar from './components/Navbar'
import Register from './pages/Register';
import Rooms from './pages/Rooms';
import CreateRoom from './pages/CreateRoom';
//import GameList from './pages/gameList';

function App() {
  return (

    <>

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/create-room" element={<CreateRoom />} />
        {/* <Route path="/gameList" element={<GameList />} /> */}
      </Routes>
    </>
  );
}

export default App; 