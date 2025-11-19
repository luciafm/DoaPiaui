// firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDPYjOTO3Rdu7Rt6JD0_mab0AV40eBqJL8",
  authDomain: "doacao-main.firebaseapp.com",
  projectId: "doacao-main",
  storageBucket: "doacao-main.firebasestorage.app",
  messagingSenderId: "600433774648",
  appId: "1:600433774648:web:43ad92080b25c98aec56cd",
  measurementId: "G-PCLXBJM554"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
