import { Injectable } from '@angular/core';

const TOKEN = 'token';
const USER = 'user';

@Injectable({
  providedIn: 'root',
})
export class UserStorageService {
  constructor() {}

  private static isBrowser(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    );
  }

  static saveToken(token: string) {
    if (this.isBrowser()) {
      window.localStorage.removeItem(TOKEN);
      window.localStorage.setItem(TOKEN, token);
    }
  }

  static saveUser(user: any) {
    if (this.isBrowser()) {
      window.localStorage.removeItem(USER);
      window.localStorage.setItem(USER, JSON.stringify(user));
    }
  }

  static getToken(): string {
    if (this.isBrowser()) {
      const token = localStorage.getItem(TOKEN);
      return token ?? '';
    }
    return '';
  }

  static getUser(): any {
    if (this.isBrowser()) {
      const userStr = localStorage.getItem(USER);
      if (userStr === null) {
        return null;
      }
      return JSON.parse(userStr);
    }
    return null;
  }

  static getUserId(): string {
    const user = this.getUser();
    if (user === null) {
      return '';
    }
    return user.id;
  }

  static getUserRole(): string {
    const user = this.getUser();
    if (user === null) {
      return '';
    }
    return user.role;
  }

  static isAdminLoggedIn(): boolean {
    if (this.getToken() === null) {
      return false;
    }
    const role: string = this.getUserRole();
    return role === 'ADMIN';
  }

  static isCustomerLoggedIn(): boolean {
    if (this.getToken() === null) {
      return false;
    }
    const role: string = this.getUserRole();
    return role === 'CUSTOMER';
  }

  static signOut(): void {
    if (this.isBrowser()) {
      window.localStorage.removeItem(TOKEN);
      window.localStorage.removeItem(USER);
    }
  }
}
