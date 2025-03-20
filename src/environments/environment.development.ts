import { initializeApp } from 'firebase/app';

export const environment = {
  firebaseConfig: {
    apiKey: process.env['FIREBASE_API'],
    authDomain: 'mini-social-network-a9d09.firebaseapp.com',
    projectId: 'mini-social-network-a9d09',
    storageBucket: 'mini-social-network-a9d09.firebasestorage.app',
    messagingSenderId: '292788951541',
    appId: '1:292788951541:web:9735a742ab95da571128bc',
  },
};

const app = initializeApp(environment.firebaseConfig);
