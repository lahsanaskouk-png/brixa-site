import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBmOOERF0KkDQ7G08L7_F7TuM7SItkoO_o",
  authDomain: "brtiol.firebaseapp.com",
  projectId: "Ybrtiol",
  storageBucket: "brtiol.firebasestorage.app",
  messagingSenderId: "711908351848",
  appId: "1:711908351848:web:a6c1ac4836988c4a7340dd"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
