import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyC0vxQL149rDc9SHoTQQfZ5VtcU6tc0UBs",
  authDomain: "fir-test-2b823.firebaseapp.com",
  projectId: "fir-test-2b823",
  storageBucket: "fir-test-2b823.firebasestorage.app",
  messagingSenderId: "187622107136",
  appId: "1:187622107136:web:8dd238dce711b11dc190e5"
};

  initializeApp(firebaseConfig);

  const db = getFirestore();

  export {db}