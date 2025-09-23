// 필요한 함수들을 SDK에서 임포트합니다.
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // <-- 이 부분을 추가합니다.

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBB70f6_hXMh42RyqQQJYrg63079Z5Xvxg",
  authDomain: "blood-sugar-app-84322.firebaseapp.com",
  projectId: "blood-sugar-app-84322",
  storageBucket: "blood-sugar-app-84322.firebasestorage.app",
  messagingSenderId: "963685729282",
  appId: "1:963685729282:web:79a955866ddaf1a1a6d31b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app); // <-- 이 부분을 추가합니다.