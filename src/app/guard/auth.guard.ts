import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = localStorage.getItem('currentUser');

    if (!currentUser) {
      // Guardar la URL que el usuario intentaba acceder
      const attemptedUrl = state.url;

      // tiene que ver el album como no dueño y no comprador, osea con posibilidad de comprarlo
      this.router.navigate(['/login'], { queryParams: { returnUrl: attemptedUrl } });

      return false;
    }

    return true; // Permitir acceso si el usuario está autenticado
  }
}
