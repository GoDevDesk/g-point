import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Aquí puedes modificar la solicitud saliente
    const token = localStorage.getItem('authToken'); // Recuperar el token desde el localStorage

    if (token) {
      // Clonar la solicitud y agregar el encabezado de autorización
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(authReq); // Continuar con la solicitud clonada
    }

    return next.handle(req); // Continuar con la solicitud original si no hay token
  }
}
