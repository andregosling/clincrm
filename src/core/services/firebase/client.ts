import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
	messagingSenderId: '245592072525',
	appId: '1:245592072525:web:2a1f59a5f6fd838c189704',
	measurementId: 'G-XH2TXSDQS0',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth();

// connectFirestoreEmulator(db, '127.0.0.1', 8080);
