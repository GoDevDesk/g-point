import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { map, Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'g-POINT';
  isUserLoggedIn = false;
  showGuestNav = true;

  constructor(private authService: AuthService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Ocultar el menú de invitados en login y home
        this.showGuestNav = !this.isUserLoggedIn && 
                           !event.url.startsWith('/login') && 
                           !event.url.startsWith('/home');
      }
    });
  }

  ngOnInit(): void {
    this.authService
      .getCurrentUserIdLoggedBehavior()
      .pipe(map((userId: number) => userId !== 0))
      .subscribe((isLoggedIn: boolean) => {
        this.isUserLoggedIn = isLoggedIn;
        if (!this.isUserLoggedIn) {
          var userIdFromStorage = this.authService.getCurrentUserLoggedIdFromStorage();
          this.isUserLoggedIn = userIdFromStorage != 0 ? true : false;
        }
        // Actualizar showGuestNav cuando cambia el estado de login
        this.showGuestNav = !this.isUserLoggedIn && 
                           !this.router.url.startsWith('/login') && 
                           !this.router.url.startsWith('/home');
      });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToHome() {
    this.router.navigate(['/landing']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
