import React from 'react';

interface AvatarButtonProps {
  user: 'dad' | 'mom' | 'son';
  onClick: () => void;
  isActive: boolean;
}

const userEmojis = {
  dad: '👨‍🦱',
  mom: '👩‍🦱',
  son: '👦',
};

const userNames = {
  dad: '아빠',
  mom: '엄마',
  son: '아들',
};

const AvatarButton: React.FC<AvatarButtonProps> = ({ user, onClick, isActive }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-3 rounded-full transition-all duration-300 ${isActive ? 'bg-blue-600 shadow-lg scale-110' : 'bg-gray-700 hover:bg-gray-600'}`}
    >
      <span className="text-4xl">{userEmojis[user]}</span>
      <span className={`text-lg font-bold mt-1 ${isActive ? 'text-white' : 'text-gray-300'}`}>
        {userNames[user]}
      </span>
    </button>
  );
};

export default AvatarButton;