// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your we app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyDgKK4oyz2iArZvqJFCXb2R7ffdeY1oNOs",
  authDomain: "zalo-46e97.firebaseapp.com",
  databaseURL: "https://zalo-46e97-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "zalo-46e97",
  storageBucket: "zalo-46e97.appspot.com",
  messagingSenderId: "659411315708",
  appId: "1:659411315708:web:7d5c4e9e437dd03fc76079",
  measurementId: "G-3GH10DQ7H5"
    // apiKey: 'AIzaSyDRjLuTfjjBWAmUn8YmG0IE48VfCBHJm54',
    // authDomain: 'otp-chat-45f02.firebaseapp.com',
    // projectId: 'otp-chat-45f02',
    // storageBucket: 'otp-chat-45f02.appspot.com',
    // messagingSenderId: '445148443097',
    // appId: '1:445148443097:web:d9dd87417bd459ac5729c8',
    // measurementId: 'G-EVDW3LDZJG',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);
