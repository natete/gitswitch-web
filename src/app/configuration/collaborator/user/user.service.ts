import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Http } from '@angular/http';
import { User } from './user';
import { Constants } from '../../../shared/constants';
import { MdSnackBar } from '@angular/material';

@Injectable()
export class UserService {

  private readonly USERS_URL = `${Constants.BACKEND_URL}/api/simple_git/user`;
  private readonly FORMAT_URL = '?_format=json';

  private users = new BehaviorSubject<User[]>([]);

  constructor(private http: Http,
              private snackBar: MdSnackBar) {}

  /**
   * Get the observable of the users.
   * @returns {Observable<User[]>} the observable of the users.
   */
  getUsers(username: string): Observable<User[]> {
    this.http
        .get(`${this.USERS_URL}/all/${username}${this.FORMAT_URL}`)
        .subscribe((user: any) => {
            this.users.next(user as User[])
          },
          err => {
            if (err.status === 404) {
              this.snackBar.open('User does not exist', null, { duration: 2000 })
            }
            this.users.error(err);
          });

    return this.users.asObservable();
  }
}