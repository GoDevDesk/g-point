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
 //   this.router.events.subscribe(() => {
 //     const currentUrl = this.router.url;
   //   this.isUserLoggedIn = !(
    //    this.isUserLoggedIn = true
        // this.isUserLoggedIn = true &&
        // currentUrl.startsWith('/login') || 
        // currentUrl.startsWith('/register') || 
        // currentUrl.includes('/album-detail/') // Detecta album-detail con ID dinámico
  //    );
 //   });
  }

  ngOnInit(): void {
    this.authService
      .getCurrentUserIdLoggedBehavior()
      .pipe(map((userId: number) => userId !== 0))
      .subscribe((isLoggedIn: boolean) => {
        this.isUserLoggedIn = isLoggedIn; // Actualiza dinámicamente el estado
        if (!this.isUserLoggedIn){
          var userIdFromStorage = this.authService.getCurrentUserLoggedId();
          this.isUserLoggedIn = userIdFromStorage != 0 ? true : false;
        }
      });
  }
}
