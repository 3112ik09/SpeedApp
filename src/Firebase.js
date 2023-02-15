// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBc_b2Lzj7tbpjhjUYdbgcwCOEuSbgoJP8",
  authDomain: "demoplayer-4e037.firebaseapp.com",
  projectId: "demoplayer-4e037",
  storageBucket: "demoplayer-4e037.appspot.com",
  messagingSenderId: "749569084180",
  appId: "1:749569084180:web:43cc72c54bb053f2a01001",
  measurementId: "G-9JK8L9TYRF"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
  
export { auth, provider };
export default db;