import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService : AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Aquí puedes modificar la solicitud saliente
    const token = localStorage.getItem('authToken'); // Recuperar el token desde el localStorage

    let authReq = req;

    if (token) {
      // Clonar la solicitud y agregar el encabezado de autorización
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      //return next.handle(authReq); // Continuar con la solicitud clonada
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout(); // Método para cerrar sesión
        }
        return throwError(() => error);
      })
    )
  }
}
