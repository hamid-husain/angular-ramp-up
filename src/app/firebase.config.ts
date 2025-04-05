import { environment } from 'environments/environment.development';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseApp = initializeApp(environment.firebaseConfig);

export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
