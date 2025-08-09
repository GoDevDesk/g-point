import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthReportGuard implements CanActivate {

  constructor(private authService: AuthService, private userService: UserService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const userId = this.authService.getCurrentUserLoggedIdFromStorage();

    if (userId === 0) {
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar si el usuario es creador
    return this.userService.getUserById(userId).pipe(
      map(user => {
        if (user) {
          if (user.isCreator) {
            // Si es creador, permitir acceso
            return true;
          } else {
            // Si no es creador, redirigir al home
            this.router.navigate(['/home']);
            return false;
          }
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/home']);
        return of(false);
      })
    );
  }
}