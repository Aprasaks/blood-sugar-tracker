import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { collection, query, onSnapshot, addDoc } from 'firebase/firestore'; // Firebase Firestore 함수 임포트

import { BloodSugarData } from '../types/BloodSugarData';
import DataTable from '../components/DataTable';
import { db } from '../lib/firebase'; // Firebase db 인스턴스 임포트

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HomePage: React.FC = () => {
  const [bloodSugar, setBloodSugar] = useState<number | ''>('');
  const [activity, setActivity] = useState<string>('');
  const [dataList, setDataList] = useState<BloodSugarData[]>([]);
  const [currentUser, setCurrentUser] = useState<'mom' | 'dad'>('mom');

  // Firebase에서 데이터 불러오기
  useEffect(() => {
    // 'blood-sugar-data' 컬렉션에 대한 참조
    const q = query(collection(db, "blood-sugar-data"));
    
    // 실시간으로 데이터 변경사항을 감지하는 리스너
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data: BloodSugarData[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as BloodSugarData);
      });
      setDataList(data);
    });

    // 컴포넌트 언마운트 시 리스너 해제
    return () => unsubscribe();
  }, []);

  const handleAddData = async () => {
    if (bloodSugar === '' || bloodSugar <= 0) {
      alert('유효한 혈당 수치를 입력해주세요.');
      return;
    }

    try {
      await addDoc(collection(db, "blood-sugar-data"), {
        value: Number(bloodSugar),
        activity,
        timestamp: new Date().toISOString(),
        user: currentUser,
      });
      setBloodSugar('');
      setActivity('');
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const filteredDataList = dataList.filter(item => item.user === currentUser);

  const chartData = {
    labels: filteredDataList.map(item => new Date(item.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: '혈당 수치 (mg/dL)',
        data: filteredDataList.map(item => item.value),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: '시간', color: 'white' },
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.2)' }
      },
      y: {
        title: { display: true, text: '혈당 수치', color: 'white' },
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.2)' }
      }
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center p-8">
      <Head>
        <title>혈당 관리 앱</title>
      </Head>

      <h1 className="text-4xl font-bold mb-8 text-center">어머니를 위한 혈당 관리</h1>
      
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setCurrentUser('mom')}
          className={`px-6 py-3 rounded-full font-bold transition-colors ${currentUser === 'mom' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          어머니
        </button>
        <button
          onClick={() => setCurrentUser('dad')}
          className={`px-6 py-3 rounded-full font-bold transition-colors ${currentUser === 'dad' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          아버지
        </button>
      </div>
      
      <p className="text-xl mb-4 font-semibold">
        현재 기록 중인 사용자: {currentUser === 'mom' ? '어머니' : '아버지'}
      </p>

      <div className="flex flex-col lg:flex-row w-full max-w-5xl gap-8">
        <div className="flex-1 flex flex-col items-center gap-8">
          <div className="w-full bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">혈당 기록하기</h2>
            <div className="flex flex-col space-y-4">
              <input
                type="number"
                placeholder="혈당 수치 (mg/dL)"
                value={bloodSugar}
                onChange={(e) => setBloodSugar(Number(e.target.value))}
                className="p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="활동 (예: 아침 식사, 운동 후)"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddData}
                className="p-3 rounded bg-blue-600 hover:bg-blue-700 font-bold transition-colors"
              >
                기록 추가
              </button>
            </div>
          </div>
          <div className="w-full">
             <DataTable data={filteredDataList} />
          </div>
        </div>
        
        <div className="flex-1 w-full bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">혈당 변화 추이</h2>
          {filteredDataList.length > 0 ? (
             <div className="h-96">
               <Line data={chartData} options={chartOptions} />
             </div>
          ) : (
            <p className="text-gray-400 text-center">데이터를 입력하고 혈당 변화를 확인하세요.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;