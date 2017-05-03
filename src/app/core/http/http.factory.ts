import { AuthService } from '../auth/auth.service';
import { RequestOptions, XHRBackend } from '@angular/http';
import { HttpService } from './http.service';
import { MdSnackBar } from '@angular/material';

export function httpFactory(backend: XHRBackend, options: RequestOptions, auth: AuthService, snackBar: MdSnackBar) {
    return new HttpService(backend, options, auth);
}