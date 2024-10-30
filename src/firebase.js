import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCrP2OoKwY5Tt60IJu94tr7yVzL8f753Es",
    authDomain: "whyithurts-51854.firebaseapp.com",
    projectId: "whyithurts-51854",
    storageBucket: "whyithurts-51854.appspot.com",
    messagingSenderId: "31190565944",
    appId: "1:31190565944:web:9106cf3c0ce7f2900912cd"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };