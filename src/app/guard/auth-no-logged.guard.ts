import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthNoLoggedGuard implements CanActivate {

  constructor(private authService: AuthService, private router:Router) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Obtener el parámetro `albumId` de la URL
    var userId = this.authService.getCurrentUserLoggedIdFromStorage();
    if (userId){
      this.router.navigate([`/profile/${userId}`]);
      return of(false);
    }
    return of(true);
  }
}
