// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getDatabase} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5MkGHtswQJmneIOlhMDalYJ_14Jfw6Lg",
  authDomain: "shopez-mobile-shopping-app.firebaseapp.com",
  projectId: "shopez-mobile-shopping-app",
  storageBucket: "shopez-mobile-shopping-app.firebasestorage.app",
  messagingSenderId: "995676711607",
  appId: "1:995676711607:web:dca1426a1c6aa271d97b32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app)

