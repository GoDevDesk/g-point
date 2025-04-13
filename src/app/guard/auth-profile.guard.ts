import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthProfileGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const userId = route.params['id'];
    
    return this.userService.getUserById(userId).pipe(
      map(user => {
        if (user) {
          return true;
        } else {
          this.router.navigate(['/profile-not-found']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/profile-not-found']);
        return of(false);
      })
    );
  }
}
