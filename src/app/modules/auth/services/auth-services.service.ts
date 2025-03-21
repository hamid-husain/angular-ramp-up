import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { from, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthServicesService {
  currentUser$;
  isAuthenticated = false;

  constructor(public auth: Auth) {
    this.currentUser$ = authState(this.auth);

    this.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  signup(username: string, email: string, password: string) {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      switchMap(({ user }) => updateProfile(user, { displayName: username }))
    );
  }

  logout() {
    return from(this.auth.signOut());
  }
}
