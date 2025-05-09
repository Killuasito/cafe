import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDLwHfgJOrEo2CFu-zr5WJyI5pZpIGrzpY",
  authDomain: "cafe-c765b.firebaseapp.com",
  projectId: "cafe-c765b",
  storageBucket: "cafe-c765b.firebasestorage.app",
  messagingSenderId: "504422221941",
  appId: "1:504422221941:web:c12df36c3f0eae73f3503c",
  measurementId: "G-3Z2XCW2MK8",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Serviços
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
