import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()), provideFirebaseApp(() => initializeApp({ projectId: "mini-social-network-a9d09", appId: "1:292788951541:web:9735a742ab95da571128bc", storageBucket: "mini-social-network-a9d09.firebasestorage.app", apiKey: "AIzaSyCEh2ljNim0nMYT1oLVWyzEiY3mNAICF7Q", authDomain: "mini-social-network-a9d09.firebaseapp.com", messagingSenderId: "292788951541" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({ projectId: "mini-social-network-a9d09", appId: "1:292788951541:web:9735a742ab95da571128bc", storageBucket: "mini-social-network-a9d09.firebasestorage.app", apiKey: "AIzaSyCEh2ljNim0nMYT1oLVWyzEiY3mNAICF7Q", authDomain: "mini-social-network-a9d09.firebaseapp.com", messagingSenderId: "292788951541" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),
  ],
};
