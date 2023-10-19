import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAcXLZE_dzbCZhBhaUb2us3nboMm1nESAc",
    authDomain: "findexpert-62c00.firebaseapp.com",
    projectId: "findexpert-62c00",
    storageBucket: "findexpert-62c00.appspot.com",
    messagingSenderId: "553491252743",
    appId: "1:553491252743:web:4835389fb510709edf4ca2"
};
  
  
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
