import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  credentials = { username: '', password: '' };
  isLoading = false; // Simula la carga inicial

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.authService.cleanStorage();
  }

  onInputChange() {
  }

  async onLogin(): Promise<void> {
    this.isLoading = true;
    this.authService.login(this.credentials).subscribe({
      next: async (response) => this.handleLoginResponse(response),
      error: (error) => {
        console.error('Error al iniciar sesión', error);
        this.isLoading = false;
      },
    });
  }

  private async handleLoginResponse(response: any): Promise<void> {
    try {
      const parsedResponse = this.parseResponse(response);
      this.authService.setToken(parsedResponse.token || response);
      
      if (parsedResponse.firebaseToken) {
        this.authService.loginFirebaseAuth(parsedResponse.firebaseToken);
      }
            
      const userId = await this.fetchCurrentUser();
      this.authService.CurrentUserLoggedId = userId;
      this.router.navigate(['/profile', userId]);
    } catch (error) {
      console.error('Error durante el proceso de login:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private parseResponse(response: any): any {
    if (typeof response !== 'string') return response;
    
    try {
      return JSON.parse(response);
    } catch (e) {
      return { token: response };
    }
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
