import React from 'react';

const GameListModal = ({ isOpen, onClose, games, onSelectGame }) => {
    if (!isOpen) return null; // 모달이 열리지 않았으면 랜더링하지 않음

    return (
        <div className='modal-overlay' onClick={onClose}>
            <div className='modal-content' onClick={e => e.stopPropagation()}>
                <h2>게임 목록</h2>
                <ul>
                    {games.map((game,index) =>(
                        <li key={index} onClick={() => onSelectGame(game)}>
                            {game.name}
                        </li>
                    ))}
                </ul>
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};

export default GameListModal;