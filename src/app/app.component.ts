import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'g-POINT';
  isUserLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {
    this.router.events.subscribe(() => {
      this.isUserLoggedIn = this.router.url !== '/login' && this.router.url !== '/register';  // O la ruta que tengas para el login
    });
  }
  ngOnInit(): void {
    this.authService
      .getCurrentUserIdLoggedBehavior()
      .pipe(map((userId: number) => userId !== 0))
      .subscribe((isLoggedIn: boolean) => {
        this.isUserLoggedIn = isLoggedIn; // Actualiza dinámicamente el estado
      });
  }

}
