import Head from 'next/head';
import { useRouter } from 'next/router';
import FixedHeader from '../components/ui/FixedHeader'; // FixedHeader 컴포넌트 임포트

const HomePage = () => {
    const router = useRouter();

    const handleLoginClick = () => {
        // '로그인' 버튼 클릭 시, 우리가 정의한 로그인/사용자 선택 페이지로 이동합니다.
        router.push('/login'); 
    };

    return (
        // 배경색을 깔끔한 흰색(bg-white)으로 설정하고, 중앙 정렬을 위한 컨테이너를 사용합니다.
        <div className="min-h-screen bg-white">
            <Head>
                <title>우리 가족 건강 매니저</title>
            </Head>

            {/* 1. 고정 헤더 영역 */}
            <FixedHeader 
                onLoginClick={handleLoginClick}
            />

            {/* 2. 메인 콘텐츠 영역 (중앙 정렬) */}
            <main className="max-w-7xl mx-auto p-8 pt-12">
                <section className="text-center">
                    <h2 className="text-5xl font-extrabold text-gray-800 mb-4">
                        가족 건강, 함께 나누다
                    </h2>
                    <p className="text-xl text-gray-500 mb-12">
                        어머니, 아버지, 우리의 일상 속 건강 데이터를 한 눈에 확인하고 관리하세요.
                    </p>
                </section>
                
                {/* 추후 여기에 '가족 대시보드' 컴포넌트가 들어갑니다. */}
                <div className="py-20 text-center text-gray-400 border-t border-gray-100">
                    {/* 데이터 로딩 또는 대시보드 컴포넌트 영역 */}
                    <p>현재는 랜딩 페이지이며, 이 영역에 가족 대시보드 카드가 배치됩니다.</p>
                </div>
            </main>
        </div>
    );
};

export default HomePage;