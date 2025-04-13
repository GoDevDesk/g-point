import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  credentials = { username: '', password: '' };
  isLoading = false; // Simula la carga inicial


  constructor(private authService: AuthService, private router: Router) { }

  
  ngOnInit(): void {
    //limpiar todo lo q puede haber de otro user
    this.authService.cleanStorage();
   }
  
  onInputChange() {
  }

  
  async onLogin(): Promise<void> {
    this.isLoading = true;
    this.authService.login(this.credentials).subscribe({
      next: async (response) => {
        this.authService.setToken(response.token || response);

        try {
          const userId = await this.fetchCurrentUser(); // Esperar el ID del usuario
          this.authService.CurrentUserLoggedId = userId;
          this.router.navigate(['/profile', userId]);
          this.isLoading = false;
        } catch (error) {
          console.error('Error durante el proceso de login:', error);
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error al iniciar sesión', error);
        this.isLoading = false;
      },
    });
  }

  fetchCurrentUser(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.authService.getCurrentUserLogged().subscribe({
        next: (user: User) => {
          this.authService.setCurrentUserIdBehavior(user.id);

          localStorage.setItem('currentUser', JSON.stringify(user));

          resolve(user.id); // Suponiendo que el usuario tiene un campo `id`
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }
}
