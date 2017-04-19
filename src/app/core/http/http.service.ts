import { Injectable } from '@angular/core';
import { Headers, Http, Request, RequestOptions, RequestOptionsArgs, Response, XHRBackend } from '@angular/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class HttpService extends Http {

  constructor(backend: XHRBackend,
              options: RequestOptions,
              private authService: AuthService) {
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
                .map(res => res.json())
                .catch(this.catchAuthError(this));

    // return s.asObservable();
  }

  private catchAuthError(httpService: HttpService) {
    return (res: Response) => {
      if (res.status === 401 || res.status === 403) {
        this.authService.revokeToken();
      }
      return Observable.throw(res);
    }
  }
}
