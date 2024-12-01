import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { catchError, tap } from 'rxjs';
import { UserProfile } from 'src/app/models/userProfile';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  items: MenuItem[] = [];
  activeTab: string = 'albums';

  profileId: string = ''; // ID del perfil visitado
  isOwner: boolean = false; // Indica si el usuario actual es dueño del perfil

  userProfile: any = {}; // Para almacenar los datos del usuario
  errorMessage: string = ''; // Mensaje de error a mostrar

  constructor(private route: ActivatedRoute, private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.items = [
      { label: 'Dashboard' },
      { label: 'Transactions' },
      { label: 'Products' }
    ]
    // Obtener el ID del perfil desde la URL
    this.profileId = this.route.snapshot.paramMap.get('id') || '';
    // Verificar si el usuario logueado es dueño del perfil
    this.isOwner = this.authService.isProfileOwner(this.profileId);
    this.fetchUserProfile();
  }


  fetchUserProfile(): void {
    if (this.profileId) {
      const userId = Number(this.profileId);
      if (!isNaN(userId)) {
        this.userService.getUserById(userId).pipe(
          tap((response: UserProfile) => {
            this.userProfile = response; // Guardamos la información del usuario
            console.log('Perfil del usuario:', this.userProfile); // Para depurar en consola
          }),
          catchError((error) => {
            this.errorMessage = 'Error al obtener el perfil del usuario';
            console.error(this.errorMessage, error); // Manejo de error
            throw error; // Deja que el error sea propagado
          })
        ).subscribe();
      } else {
        console.error('El ID de usuario no es válido');
      }
    }
  }
}