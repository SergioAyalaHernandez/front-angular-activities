import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError} from 'rxjs';
import {CookieService} from "ngx-cookie-service";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);  // Controlador de las solicitudes pendientes

  constructor(
    private cookieService: CookieService,
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (
      request.url.includes('/login') ||
      request.url.includes('/refresh')
    ) {
      return next.handle(request);
    }


    // Add token to the request
    const accessToken = this.cookieService.get('accessToken');
    if (accessToken) {
      request = this.addToken(request, accessToken);
    }

    // Handle the response
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized errors - token might be expired
        if (error.status === 401 && !request.url.includes('/auth/refresh/')) {
          return this.handle401Error(request, next);
        }

        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Si no estamos en medio de un refresh
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      // Intentamos refrescar el token
      return this.authService.refreshToken().pipe(
        switchMap((response) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(response.access);  // Emitir el nuevo token

          // Guardamos el nuevo token
          this.cookieService.set('accessToken', response.access, { secure: true, sameSite: 'Strict' });

          // Reintentar la solicitud original con el nuevo token
          return next.handle(this.addToken(request, response.access));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.authService.logout();
          this.router.navigate(['/login']);
          return throwError(() => error);
        })
      );
    }

    // Si ya estamos refrescando el token, hacemos que la solicitud espere hasta que se complete
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),  // Esperamos a que el token haya sido refrescado
      take(1),
      switchMap((token) => {
        return next.handle(this.addToken(request, token));  // Reintentamos la solicitud con el nuevo token
      })
    );
  }
}
