import React from 'react';

// Header는 로그인 버튼 클릭 함수만 받습니다.
interface FixedHeaderProps {
    onLoginClick: () => void;
}

const navItems = [
    { name: '대시보드', href: '/' },
    { name: '혈당관리', href: '/blood-sugar' },
    { name: '건강관리', href: '/health' },
    { name: '식단관리', href: '/diet' },
];

const FixedHeader = ({ onLoginClick }: FixedHeaderProps) => {
    return (
        // sticky top-0, z-50을 사용하여 상단에 고정하고, 그림자로 구분선 대체
        <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
            <div className="flex justify-between items-center max-w-7xl mx-auto p-4">
                
                {/* 1. 왼쪽 여백 (로고 자리) */}
                <div className="w-1/4 flex justify-start">
                    {/* 왼쪽은 비워두거나, 간단한 로고를 넣을 수 있습니다. */}
                </div>

                {/* 2. 중앙 네비게이션 목록 */}
                <nav className="flex space-x-12 text-lg font-medium text-gray-700">
                    {navItems.map((item) => (
                        <a 
                            key={item.name} 
                            href={item.href} 
                            className="hover:text-black transition-colors duration-200"
                        >
                            {item.name}
                        </a>
                    ))}
                </nav>

                {/* 3. 오른쪽 로그인 버튼 */}
                <div className="w-1/4 flex justify-end">
                    <button
                        onClick={onLoginClick}
                        // 세련된 회색 계열 버튼 디자인: 옅은 회색 배경, 진한 글씨, 부드러운 호버 효과
                        className="px-6 py-2 rounded-full bg-gray-100 text-gray-800 font-semibold transition-colors duration-200 hover:bg-gray-200 shadow-sm"
                    >
                        로그인
                    </button>
                </div>
            </div>
        </header>
    );
};

export default FixedHeader;