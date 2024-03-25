import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD4OCxxTXTBAjeI1G8D3MTDF2USR1qj3xY',
  authDomain: 'miniblog-d6357.firebaseapp.com',
  projectId: 'miniblog-d6357',
  storageBucket: 'miniblog-d6357.appspot.com',
  messagingSenderId: '425440055473',
  appId: '1:425440055473:web:4429d3756b6ac096a09290',
  measurementId: 'G-0TXJLKVHXB',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
