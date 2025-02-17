import { Injectable, WritableSignal, computed, effect, signal } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { AuthState } from './auth-state.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState: WritableSignal<AuthState> = signal<AuthState>({
    user: this.getUser(),
    token: this.getToken(), // get token from localStorage, if there
    isAuthenticated: this.verifyToken(this.getToken()) // verify it's not expired
  });

  isAuthenticated$ = computed(() => this.authState().isAuthenticated);

  user = computed(() => this.authState().user);
  token = computed(() => this.authState().token);
  isAuthenticated = computed(() => this.authState().isAuthenticated);

  constructor() {
    effect(() => {
      const token = this.authState().token;
      const user = this.authState().user;
      if (typeof localStorage !== 'undefined') {
        if (token !== null) {
          localStorage.setItem("token", token);
        } else {
          localStorage.removeItem("token");
        }
        if (user !== null) {
          localStorage.setItem("user", user);
        } else {
          localStorage.removeItem("user");
        }
      }
    });
  }

  updateToken(token: string): void {
    const decodedToken: any = jwtDecode(token);
    const user = decodedToken.user;
    this.authState.set({
      user: user,
      token: token,
      isAuthenticated: this.verifyToken(token)
    });
  }

  getToken(): string | null {
    return typeof localStorage !== 'undefined' ? localStorage.getItem("token") : null;
  }

  getUser(): string | null {
    return typeof localStorage !== 'undefined' ? localStorage.getItem("user") : null;
  }

  verifyToken(token: string | null): boolean {
    if (token !== null) {
      try {
        const decodedToken = jwtDecode(token);
        const expiration = decodedToken.exp;
        if (expiration === undefined || Date.now() >= expiration * 1000) {
          return false; // expiration not available or in the past
        } else {
          return true; // token not expired
        }
      } catch (error) {  // invalid token
        return false;
      }
    }
    return false;
  }

  isUserAuthenticated(): boolean {
    return this.verifyToken(this.getToken());
  }

  logout() {
    this.authState.set({
      user: null,
      token: null,
      isAuthenticated: false
    });
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }
}
