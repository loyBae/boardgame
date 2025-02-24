import React from 'react';

const GameListModal = ({ isOpen, onClose, game }) => {
    if (!isOpen || !game) return null; // 모달이 열리지 않았으면 랜더링하지 않음

    return (
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center' onClick={{onClose}}>
            <div className='bg-white p-6 rounded-lg shadow-lg w-96' onClick={(e) => e.stopPropagation()}>
                <h2 className='text-xl font-bold'>{game.title}</h2>
                <img src={game.image} alt={game.title} className='w-full h-40 object-cover rounded-lg my-3' />
                <p className='text-gray-700'>{game.description}</p>
                <p className='tet-gray-500'>레벨: {game.level}</p>
                <button className='bg-red-500 text-whote px-4 py-2 rounded mt-4' onClick={onClose}>닫기</button>
            </div>

        </div>
    );
};

export default GameListModal;