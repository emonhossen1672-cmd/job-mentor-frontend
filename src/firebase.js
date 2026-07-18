import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCCIf4b-gDM9bO3ydpt5BIMMBaLuQe8tGc",
  authDomain: "job-mentor-4f327.firebaseapp.com",
  projectId: "job-mentor-4f327",
  storageBucket: "job-mentor-4f327.firebasestorage.app",
  messagingSenderId: "926368386068",
  appId: "1:926368386068:web:0965fb470079e86ea2eb01",
  measurementId: "G-KRNYS7ML7Y"
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
