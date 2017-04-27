import { Injectable } from '@angular/core';
import { Headers, Http, Request, RequestOptions, RequestOptionsArgs, Response, XHRBackend } from '@angular/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { MdSnackBar } from '@angular/material';

@Injectable()
export class HttpService extends Http {

  constructor(backend: XHRBackend,
              options: RequestOptions,
              private authService: AuthService,
              private snackBar: MdSnackBar) {
    super(backend, options);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {

    // const s = new Subject<Response>();

    const authData = this.authService.getAccessToken();

    if (authData && authData.tokenType) {
      if (typeof url === 'string') {
        if (!options) {
          options = { headers: new Headers() };
        }
        options.headers.set('Authorization', `${authData.tokenType} ${authData.accessToken}`);
        options.headers.set('Content-Type', 'application/json');
      } else {
        // we have to add the token to the url object
        url.headers.set('Authorization', `${authData.tokenType} ${authData.accessToken}`);
        url.headers.set('Content-Type', 'application/json');
      }
    }

    return super.request(url, options)
                .map(res => this.getJsonResponse(res))
                .catch(this.catchAuthError(this));

    // return s.asObservable();
  }

  private catchAuthError(httpService: HttpService) {
    return (res: Response) => {
      if (res.status === 401 || res.status === 403) {
        this.authService.revokeToken();
      }else if (res.status === 409) {
        this.snackBar.open('You have already added this account', null, { duration: 2000 })
      } else if (res.status === 404) {
        this.snackBar.open('User does not exist', null, { duration: 2000 })
      }
      return Observable.throw(res);
    }
  }

  private getJsonResponse(res: Response) {
    try {
      return res ? res.json() : null
    } catch (e) {
      return null;
    }
  }
}
