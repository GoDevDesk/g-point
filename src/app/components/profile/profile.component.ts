import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { catchError, tap } from 'rxjs';
import { UserProfile } from 'src/app/models/userProfile';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
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

  isModalOpen = false; // Control del estado del modal
  defaultPhoto = 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg';
  currentPhoto = this.defaultPhoto; // URL de la foto actual
  profilePictureId : number = 0;  // URL de la foto actual

  private haveProfilePicture: boolean = false;


  constructor(private route: ActivatedRoute, private authService: AuthService, private userService: UserService, private profileService: ProfileService) { }

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
    this.fetchProfilePhoto(); // Cargar la foto de perfil
    this.authService.setVisitedProfileId(Number(this.profileId));
  }


  // Abrir el modal
  openModal(event: Event): void {
    event.preventDefault(); // Prevenir comportamiento por defecto del enlace
    this.isModalOpen = true;
  }

  // Cerrar el modal
  closeModal(): void {
    this.isModalOpen = false;
  }

  handlePhotoSelected(file: File): void {
    debugger;
    if (!this.haveProfilePicture) {
      this.profileService.createPhoto(file, this.profileId).subscribe({
        next: (response) => {
          console.log('Foto subida correctamente:', response);

          this.currentPhoto = URL.createObjectURL(file); // Actualiza la foto en la vista previa
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al enviar foto al servidor:', error);
        },
      });
    }
    else{
      this.profileService.updatePhoto(file, this.profilePictureId).subscribe({
        next: (response) => {
          console.log('Foto modificada correctamente:', response);

          this.currentPhoto = URL.createObjectURL(file); // Actualiza la foto en la vista previa
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al enviar foto al servidor:', error);
        },
      });
    }
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

  fetchProfilePhoto(): void {
    const userId = Number(this.profileId);
    if (!isNaN(userId)) {
      this.profileService.getProfilePhoto(userId).subscribe({
        next: (profilePicture: any) => {
          this.currentPhoto = profilePicture.url_File; // Actualiza la foto de perfil
          this.profilePictureId = profilePicture.id;
          console.log('Foto de perfil obtenida:', this.currentPhoto);
          this.haveProfilePicture = true;
        },
        error: (error) => {
          console.error('Error al obtener la foto de perfil:', error);
          this.errorMessage = 'No se pudo cargar la foto de perfil';
        },
      });
    } else {
      console.error('El ID de usuario no es válido');
    }
  }
}