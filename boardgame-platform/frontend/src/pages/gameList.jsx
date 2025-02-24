// src/pages/gameList.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"; // 유효성 검사를 쉽게 할 수 있는 , 성능 우수하고 확장 가능한 form 제공 라이브러리
import GameListModal from './gameListModal';

const games = [
    {
        id: 1,
        title: "루미큐브",
        description: "전략적인 숫자 타일 게임",
        level: "중급",
        image: "",
    },
    {
        id: 2,
        title: "체스",
        description: "고전적인 숫자 타일 게임",
        level: "고급",
        image: "",
    },
];




export default function gameList() {
    // 추가 : 모달 열림 상태 관리
    const [isModalOpen, setModalOpen] = useState(false);
    // 추가 : 선택된 게임 정보 상태 관리
    const [selectedGame, setSelectedGame] = useState(null);

    // 게임 클릭 시 모달을 열고 해당 게임 정보를 설정
    const handleGameClick = (game) => {
        console.log('선택된 게임: ', game); //디버깅용
        setSelectedGame(game);
        setModalOpen(true);
        // 이후 게임 상세 정보 및 생성 화면으로 전환하는 로직 추가
    }


    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
            <nav className='text-white px-6 py-3 flex justify-between items-start w-full'>
                <h2 className='text-xl text-black'>보드게임</h2>
            </nav>
            <div className='flex overflow-x-auto space-x-4 scrollbar-hide'>
                {games.map((game) => (
                    <div 
                        key={game.id} 
                        className='min-w-[200px] w-48 bg-gray-900 p-3 rounded-lg shadow-lg'
                        onClick={() => handleGameClick(game)} // 게임 카드 클릭시 모달 열기
                        >
                        <img src={game.image } alt={game.title} className='w-full h-32 object-cover rounded-lg' />
                        <h3 className='text-lg font-semibold mt-2'>{game.title}</h3>
                        <p className='text-gray-400 text-sm'>{game.description}</p>
                        <p className='text-gray-500 text-xs mt-1'>{game.level}</p>
                    </div>
                ))}
            </div>

               {/* 모달 컴포넌트 추가*/}
                <GameListModal
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    game={selectedGame} // 선택된 게임 전달
                />
            </div>
        
    );

}

