import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyABFKB4zyzNH6nikNlljLhI_IK0eyx-e9w',
  authDomain: 'kodluyoruz-bootcamp-rn.firebaseapp.com',
  projectId: 'kodluyoruz-bootcamp-rn',
  storageBucket: 'kodluyoruz-bootcamp-rn.appspot.com',
  messagingSenderId: '167883173364',
  appId: '1:167883173364:web:da240daa5af598f6b59da1',
  measurementId: 'G-5SEZXFEETB',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
