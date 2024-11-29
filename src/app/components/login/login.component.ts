import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  credentials = { username: '', password: '' }; // Datos de usuario

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onLogin(): void {
    this.authService.login(this.credentials).subscribe(
      (response) => {
        // Almacenar el token
        this.authService.setToken(response.token);
        console.log('Usuario autenticado');
        // Redirigir a otra página (ej. dashboard)
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Error al iniciar sesión', error);
      }
    );
  }
}
