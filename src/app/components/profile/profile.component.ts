import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap } from 'rxjs';
import { ForeignProfileData } from 'src/app/models/foreignProfileData';
import { User } from 'src/app/models/user';
import { UserProfile } from 'src/app/models/userProfile';
import { AuthService } from 'src/app/services/auth.service';
import { FollowsService } from 'src/app/services/follows.service';
import { ProfileService } from 'src/app/services/profile.service';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { UserService } from 'src/app/services/user.service';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  items: any[] = [];
  activeTab: string = 'albums';

  profileId: string = ''; // ID del perfil visitado
  isOwner: boolean = false; // Indica si el usuario actual es dueño del perfil

  userProfile: any = {}; // Para almacenar los datos del usuario
  errorMessage: string = ''; // Mensaje de error a mostrar

  isModalOpen = false; // Control del estado del modal
  defaultPhoto = 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg';
  currentPhoto = this.defaultPhoto; // URL de la foto actual
  profilePictureId: number = 0;  // URL de la foto actual

  private haveProfilePicture: boolean = false;
  isChatOpen = false;

  senderId = ''; // Cambia esto al ID del usuario actual (por ejemplo, desde un servicio de autenticación)
  receiverId = ''; // Cambia esto al ID del usuario con el que se desea chatea

  isFollowed = false; // Estado inicial para follow
  isSubscribed = false; // Estado inicial para subscribe


  constructor(private route: ActivatedRoute, private authService: AuthService, private userService: UserService, private profileService: ProfileService,
    private subscriptionsService: SubscriptionsService, private followsService: FollowsService, private router: Router) { }

  ngOnInit(): void {
    this.getCurrentLoggedIdUser();
    this.profileId = this.route.snapshot.paramMap.get('id') || '';

      // Escuchar cambios en la URL
  this.route.paramMap.subscribe(params => {
    this.profileId = params.get('id') || ''; // Capturar el nuevo ID de la URL
    console.log('Cambio detectado en la URL. Nuevo ID:', this.profileId);

    // Llama al método reloadPage para actualizar todo el estado del componente
    this.reloadPage();
  });

    this.items = [
      { label: 'Dashboard' },
      { label: 'Transactions' },
      { label: 'Products' }
    ]
  //  this.reloadPage();

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
    else {
      this.profileService.updatePhoto(file, this.profilePictureId).subscribe({
        next: (response) => {
          console.log('Foto modificada correctamente:', response);

          this.currentPhoto = URL.createObjectURL(file); // Actualiza la foto en la vista previa
          this.profileService.setAvatarPhoto(this.currentPhoto);
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
          this.profileService.setAvatarPhoto(this.currentPhoto);
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

  getCurrentLoggedIdUser(): void {
    this.authService.getCurrentUserLogged().subscribe({
      next: (response: User) => {
        console.log('Obtenido correctamente:', response);
        this.authService.CurrentUserLoggedId = response.id;
        this.senderId = response.id.toString(); // Asignar el id del usuario a senderId
      },
      error: (error) => {
        console.error('Error al conseguir usuario logueado', error);
      },
    });
  }

  GetForeignProfileData(userId: number): void {
    this.userService.GetForeignProfileData(userId).subscribe({
      next: (response: ForeignProfileData) => {
        console.log('Obtenido correctamente:', response);
        this.isFollowed = response.hasFollow;
        this.isSubscribed = response.hasSubscription
      },
      error: (error) => {
        console.error('Error al conseguir usuario logueado', error);
      },
    });
  }

    toggleFollow(): void {
      // Cambiar el estado en el backend
      this.isFollowed = !this.isFollowed;
      this.followsService.updateFollowStatus(Number(this.profileId) ,this.isFollowed).subscribe({
        next: () => console.log('Follow status updated successfully'),
        error: (error) => console.error('Error updating follow status:', error)
      });
    }

   toggleSubscribe(): void {
     // Cambiar el estado en el backend
     this.isSubscribed = !this.isSubscribed;
     this.subscriptionsService.updateSubscribeStatus(Number(this.profileId) ,this.isSubscribed).subscribe({
       next: () => console.log('Subscribe status updated successfully'),
       error: (error) => console.error('Error updating subscribe status:', error)
     });
   }


  // subscribeUser() {
  //   this.subscriptionService.subscribeToUser().subscribe({
  //     next: (response) => {
  //       console.log('User subscribed successfully:', response);
  //       alert('You have successfully subscribed!');
  //     },
  //     error: (error) => {
  //       console.error('Error subscribing the user:', error);
  //       alert('There was an error. Please try again.');
  //     }
  //   });
  // }

  reloadPage(){
    this.isOwner = this.authService.isProfileOwner(this.profileId);
    if (!this.isOwner){
      this.receiverId = this.profileId;
      this.GetForeignProfileData(Number(this.profileId));

    }
    this.fetchUserProfile();
    this.fetchProfilePhoto(); 
    this.authService.setVisitedProfileId(Number(this.profileId));
  }

  openChat() {
    this.router.navigate(['/chat']);
    //this.isChatOpen = true;
  }

  closeChat() {
    this.isChatOpen = false;
  }
}