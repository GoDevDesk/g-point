import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user'; // Asegúrate de importar tu modelo
import { UserRegister } from 'src/app/models/userRegister';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  user: UserRegister = new UserRegister(); // Se inicializa como una instancia del modelo User
  confirmPassword: string = ''; // Campo adicional para confirmar la contraseña
  isLoading = false; // Estado de carga

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  async onRegister(): Promise<void> {
    if (this.user.Password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
  
    this.isLoading = true;
  
    // Preparamos los datos en el formato que espera el backend
    const requestData: UserRegister = {
      UserName: this.user.UserName,
      Password: this.user.Password,
      EmailAddress: this.user.EmailAddress,
      FirstName: this.user.FirstName,
      LastName: this.user.LastName || '',
    };

    this.authService.register(requestData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/login']); // Redirige al login después de registrar
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }}