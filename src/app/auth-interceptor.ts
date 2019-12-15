import { HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // Get the auth token from the service.
        const authToken = sessionStorage.getItem('token');
        // Clone the request and replace the original headers with
        // cloned headers, updated with the authorization.
        if (authToken) {

            const authReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${authToken}`)
            });
            return next.handle(authReq); // send cloned request with header to the next handler.
        }
        return next.handle(req);
    }
}