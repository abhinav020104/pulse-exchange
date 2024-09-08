// Import the functions you need from the SDKs you need
"use client"
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtsPjzHocHeZIIW_5sDopoDIlCjeAEF6Q",
  authDomain: "pulse-exchange.firebaseapp.com",
  projectId: "pulse-exchange",
  storageBucket: "pulse-exchange.appspot.com",
  messagingSenderId: "302542548131",
  appId: "1:302542548131:web:b1df967a59d3a98e7ea316",
  measurementId: "G-SPP4D7HSZ8"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);