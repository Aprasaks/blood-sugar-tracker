import Head from 'next/head';
import { useRouter } from 'next/router';

const HomePage = () => {
  const router = useRouter();

  const handleStartClick = () => {
    router.push('/who-are-you'); // <-- 로그인 페이지 대신 who-are-you 페이지로 이동
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center p-8">
      <Head>
        <title>우리 가족 혈당 관리</title>
      </Head>
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-4">우리 가족 혈당 관리</h1>
        <p className="text-xl text-gray-400 mb-8">
          매일의 혈당 수치와 걸음 수를 기록하고, 한눈에 변화를 확인하세요.
          <br />
          어머니와 아버지의 건강한 생활을 돕는 가족 맞춤형 솔루션입니다.
        </p>
        <button 
          onClick={handleStartClick}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          관리하기
        </button>
      </div>
    </div>
  );
};

export default HomePage;