import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDcdsntC0dmGRU2FuNic9f1M0uEXvWyVGs",
  authDomain: "aula1505-f9b65.firebaseapp.com",
  projectId: "aula1505-f9b65",
  storageBucket: "aula1505-f9b65.firebasestorage.app",
  messagingSenderId: "112330721527",
  appId: "1:112330721527:web:9c6ffd8a70bf12832fabf2",
  measurementId: "G-9764VW8STR"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
