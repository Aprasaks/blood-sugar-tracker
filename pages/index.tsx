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
import { collection, query, onSnapshot, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';

import { BloodSugarData } from '../types/BloodSugarData';
import DataTable from '../components/DataTable';
import AvatarButton from '../components/AvatarButton';
import { db } from '../lib/firebase';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// 구글 API 키 정보
const GOOGLE_FIT_CLIENT_ID = "343393052874-r9t475fvfp868femt98nn0h9dfbertql.apps.googleusercontent.com";
const GOOGLE_FIT_REDIRECT_URI = "http://localhost:3000";
const GOOGLE_FIT_SCOPES = "https://www.googleapis.com/auth/fitness.activity.read";

const HomePage: React.FC = () => {
  const [bloodSugar, setBloodSugar] = useState<number | ''>('');
  const [activity, setActivity] = useState<string>('');
  const [dataList, setDataList] = useState<BloodSugarData[]>([]);
  const [currentUser, setCurrentUser] = useState<'mom' | 'dad' | 'son'>('mom');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isGoogleFitConnected, setIsGoogleFitConnected] = useState<{ mom: boolean; dad: boolean; son: boolean }>({
    mom: false,
    dad: false,
    son: false,
  });
  const [stepCount, setStepCount] = useState<number | null>(null); // <-- 걸음 수 상태

  useEffect(() => {
    const savedConnections = localStorage.getItem('googleFitConnections');
    if (savedConnections) {
      setIsGoogleFitConnected(JSON.parse(savedConnections));
    }
  }, []);

  useEffect(() => {
    const q = query(collection(db, "blood-sugar-data"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data: BloodSugarData[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as BloodSugarData);
      });
      setDataList(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = urlParams.get('access_token');
    
    if (accessToken) {
      console.log("Access Token received: ", accessToken);
      getGoogleFitData(accessToken);
      
      const newConnections = { ...isGoogleFitConnected, [currentUser]: true };
      setIsGoogleFitConnected(newConnections);
      localStorage.setItem('googleFitConnections', JSON.stringify(newConnections));
    }
  }, [currentUser]);

  const getGoogleFitData = async (accessToken: string) => {
    const now = new Date();
    const endTimeMillis = now.getTime();
    const startTimeMillis = now.getTime() - (15 * 60 * 1000);

    const response = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        aggregateBy: [{
          dataTypeName: 'com.google.step_count.delta',
          dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
        }],
        bucketByTime: { durationMillis: 60000 },
        startTimeMillis: startTimeMillis,
        endTimeMillis: endTimeMillis
      })
    });
    
    const data = await response.json();
    console.log("Google Fit Data:", data);

    if (data.bucket && data.bucket.length > 0) {
      const latestBucket = data.bucket[data.bucket.length - 1];
      if (latestBucket.dataset && latestBucket.dataset.length > 0) {
        const latestDataset = latestBucket.dataset[latestBucket.dataset.length - 1];
        if (latestDataset.point && latestDataset.point.length > 0) {
          const stepCount = latestDataset.point[0].value[0].intVal;
          setStepCount(stepCount);
          console.log("걸음 수:", stepCount);
        }
      }
    }
  };

  const handleGoogleFitLogin = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `scope=${GOOGLE_FIT_SCOPES}` +
      `&redirect_uri=${GOOGLE_FIT_REDIRECT_URI}` +
      `&response_type=token` +
      `&client_id=${GOOGLE_FIT_CLIENT_ID}`;
    window.location.href = authUrl;
  };

  const handleAddData = async () => {
    if (bloodSugar === '' || bloodSugar <= 0) {
      alert('유효한 혈당 수치를 입력해주세요.');
      return;
    }
    try {
      if (editingId) {
        const docRef = doc(db, "blood-sugar-data", editingId);
        await updateDoc(docRef, { value: Number(bloodSugar), activity });
        setEditingId(null);
      } else {
        await addDoc(collection(db, "blood-sugar-data"), {
          value: Number(bloodSugar),
          activity,
          timestamp: new Date().toISOString(),
          user: currentUser,
        });
      }
      setBloodSugar('');
      setActivity('');
    } catch (e) {
      console.error("Error adding/updating document: ", e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (confirm('정말로 이 기록을 삭제하시겠습니까?')) {
        const docRef = doc(db, "blood-sugar-data", id);
        await deleteDoc(docRef);
      }
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const handleEdit = (data: BloodSugarData) => {
    setBloodSugar(data.value);
    setActivity(data.activity);
    setEditingId(data.id);
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
      x: { title: { display: true, text: '시간', color: 'white' }, ticks: { color: 'white' }, grid: { color: 'rgba(255, 255, 255, 0.2)' } },
      y: { title: { display: true, text: '혈당 수치', color: 'white' }, ticks: { color: 'white' }, grid: { color: 'rgba(255, 255, 255, 0.2)' } }
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center p-8">
      <Head>
        <title>우리 가족 혈당 관리</title>
      </Head>
      <h1 className="text-4xl font-bold mb-8 text-center">우리 가족 혈당 관리 어플</h1>
      
      {/* 아바타 버튼 목록 */}
      <div className="flex space-x-4 mb-8">
        <AvatarButton user="mom" onClick={() => setCurrentUser('mom')} isActive={currentUser === 'mom'} />
        <AvatarButton user="dad" onClick={() => setCurrentUser('dad')} isActive={currentUser === 'dad'} />
        <AvatarButton user="son" onClick={() => setCurrentUser('son')} isActive={currentUser === 'son'} />
      </div>
      
      {/* 메인 레이아웃: 기록/그래프 */}
      <div className="flex flex-col lg:flex-row w-full max-w-5xl gap-8">
        <div className="flex-1">
          <div className="w-full bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
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
                {editingId ? '기록 수정' : '기록 추가'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 w-full bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
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

      {/* 전체 기록 테이블 */}
      <div className="w-full max-w-5xl mb-8">
        <DataTable data={filteredDataList} onDelete={handleDelete} onEdit={handleEdit} />
      </div>
      
      {/* 실시간 걸음 수 표시 및 연동 버튼 */}
      <div className="w-full max-w-5xl text-center bg-gray-800 p-6 rounded-lg shadow-lg">
        {!isGoogleFitConnected[currentUser] ? (
          <button onClick={handleGoogleFitLogin} className="p-3 rounded bg-green-600 hover:bg-green-700 font-bold transition-colors">
            구글 피트니스 연동하기
          </button>
        ) : (
          <p className="text-xl font-bold">
            실시간 걸음 수: {stepCount !== null ? stepCount : '데이터를 가져오는 중...'} 걸음
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;