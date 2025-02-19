// src/pages/gameList.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"; // 유효성 검사를 쉽게 할 수 있는 , 성능 우수하고 확장 가능한 form 제공 라이브러리

const games = [
    {
        id: 1,
        title: "루미큐브",
        description: "",
        level: "",
        image: "",
    },
    {
        id: 2,
        title: "체스",
        description: "",
        level: "",
        image: "",
    },
]

export default function gameList() {

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
            <nav className='text-white px-6 py-3 flex justify-between items-start w-full'>
                <h2 className='text-xl text-black'>보드게임</h2>
                <span className='text-xl text-black'>"호돈신님"</span>
            </nav>
            <div className='flex overflow-x-auto space-x-4 scrollbar-hide'>
                {games.map((game) => (
                    <div key={game.id} className='min-w-[200px] w-48 bg-gray-900 p-3 rounded-lg shadow-lg'>
                        <img src={game.image} alt={game.title} className='w-full h-32 object-cover rounded-lg' />
                        <h3 className='text-lg font-semibold mt-2'>{game.title}</h3>
                        <p className='text-gray-400 text-sm'>{game.description}</p>
                        <p className='text-gray-500 text-xs mt-1'>{game.level}</p>
                    </div>
                ))}
            </div>
        </div>
    );

}

