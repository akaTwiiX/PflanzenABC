import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { environment } from 'src/environments/environment';

const app = getApps().length ? getApp() : initializeApp(environment.firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
