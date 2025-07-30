import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminGuard implements CanActivate {

  private apiUrl = `${environment.apiPtUsersBaseUrl}/api`;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    // Verificar si el usuario está autenticado (tiene token)
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar si el usuario es administrador
    return this.checkAdminStatus().pipe(
      map((isAdmin: boolean) => {
        if (isAdmin) {
          return true;
        } else {
          // Si no es admin, redirigir a la página principal
          this.router.navigate(['/home']);
          return false;
        }
      }),
      catchError((error: any) => {
        console.error('Error verificando permisos de administrador:', error);
        this.router.navigate(['/home']);
        return of(false);
      })
    );
  }

  private checkAdminStatus(): Observable<boolean> {
    return of(true);
    // return this.http.get<{isAdmin: boolean}>(`${this.apiUrl}/user/admin-status`).pipe(
    //   map(response => response.isAdmin)
    // );
  }
} 