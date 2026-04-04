import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../../environments/environment';

const app = getApps().length ? getApp() : initializeApp(environment.firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
