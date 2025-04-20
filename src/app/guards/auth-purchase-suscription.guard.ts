import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthPurchaseSuscriptionGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    var userId = this.authService.getCurrentUserLoggedIdFromStorage();
    if (userId) {
      // por ahora no va a ningun lado pero va a ir al modal de compra y detalles de suscripcion
      return true;
    }
    return this.router.navigate(['/login']);
  }
}
