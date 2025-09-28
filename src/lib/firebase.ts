
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC6JpwtblO6jEweQ8kPhb6j0LfWj1MmXIg",
  authDomain: "taskflow-4821b.firebaseapp.com",
  projectId: "taskflow-4821b",
  storageBucket: "taskflow-4821b.appspot.com",
  messagingSenderId: "704454497611",
  appId: "1:704454497611:web:0493f6511c0483da0104ce",
  measurementId: "G-1G8ZCKF3HW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
