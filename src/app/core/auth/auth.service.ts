import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { TokenService } from './token.service';
import { Auth } from './auth';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

  constructor(private tokenService: TokenService,
              private router: Router) { }

  /**
   * Check if there is a token.
   * @returns {Observable<boolean>}.
   */
  isAuthenticated(): Observable<boolean> {
    let isAuthSubject = new ReplaySubject<boolean>();

    isAuthSubject.next(!!this.tokenService.getToken());

    return isAuthSubject.asObservable();
  }

  /**
   * Return the current token.
   * @returns {Auth} string or undefined if no token has been set.
   */
  getAccessToken(): Auth {
    return new Auth(this.tokenService.getToken());
  }

  /**
   * Removes the current token.
   */
  revokeToken(): void {
    this.tokenService.revokeToken();
    this.router.navigate(['/login']);
  }
}
