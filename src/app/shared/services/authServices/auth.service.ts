import { Injectable } from '@angular/core';

import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { from, map, Observable, switchMap } from 'rxjs';

import { auth } from '@app/firebase.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$: Observable<User | null>;
  isAuthenticated$: Observable<boolean>;

  constructor() {
    this.currentUser$ = new Observable<User | null>(subscriber => {
      return onAuthStateChanged(auth, subscriber);
    });

    this.isAuthenticated$ = this.currentUser$.pipe(map(user => !!user));
  }

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(auth, email, password));
  }

  signup(username: string, email: string, password: string) {
    return from(createUserWithEmailAndPassword(auth, email, password)).pipe(
      switchMap(({ user }) => updateProfile(user, { displayName: username }))
    );
  }

  logout() {
    return from(signOut(auth));
  }
}
