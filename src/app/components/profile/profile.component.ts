import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap } from 'rxjs';
import { ForeignProfileData } from 'src/app/models/foreignProfileData';
import { User } from 'src/app/models/user';
import { UserProfile } from 'src/app/models/userProfile';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { CoverService } from 'src/app/services/cover.service';
import { FollowsService } from 'src/app/services/follows.service';
import { ProfileService } from 'src/app/services/profile.service';
import { PlanService } from 'src/app/services/plan.service';
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
  userId: number = 0; // ID del perfil visitado
  isOwner: boolean = false; // Indica si el usuario actual es dueño del perfil

  userProfile: any = {}; // Para almacenar los datos del usuario
  errorMessage: string = ''; // Mensaje de error a mostrar

  isProfileModalOpen = false; // Control del estado del modal perfil
  isCoverModalOpen = false; // Control del estado del modal perfil

  defaultPhoto = 'assets/defaultIcons/defaultProfilePhoto.png';

  currentProfilePhoto = this.defaultPhoto; // URL de la foto actual
  currentCoverPhoto = this.defaultPhoto; // URL de la foto actual
  profilePictureId: number = 0;  // URL de la foto actual
  coverPictureId: number = 0;  // URL de la foto actual

  private haveProfilePicture: boolean = false;
  private haveCoverPicture: boolean = false;
  isChatOpen = false;

  senderId = ''; // Cambia esto al ID del usuario actual (por ejemplo, desde un servicio de autenticación)
  receiverId = ''; // Cambia esto al ID del usuario con el que se desea chatea

  isFollowed = false; // Estado inicial para follow
  isSubscribed = false; // Estado inicial para subscribe
  isLoading = false; // Estado de carga
  hasPlan = false; // Estado para controlar si existe un plan
  isCreatePlanModalOpen = false; // Control del estado del modal de creación de plan

  constructor(private route: ActivatedRoute, private authService: AuthService, private userService: UserService, private profileService: ProfileService,
    private coverService: CoverService, private planService: PlanService, private followsService: FollowsService, private router: Router,
    private chatService: ChatService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.getCurrentLoggedIdUser();
    this.profileId = this.route.snapshot.paramMap.get('id') || '';

    // Escuchar cambios en la URL
    this.route.paramMap.subscribe(params => {
      this.profileId = params.get('id') || ''; // Capturar el nuevo ID de la URL
      this.currentCoverPhoto = this.defaultPhoto;
      this.loadPage();
    });

    this.items = [
      { label: 'Dashboard' },
      { label: 'Transactions' },
      { label: 'Products' }
    ]
  }

  // Abrir el modal perfil
  openProfileModal(event: Event): void {
    event.preventDefault(); // Prevenir comportamiento por defecto del enlace
    this.isProfileModalOpen = true;
  }

  // Abrir el modal portada
  openCoverModal(event: Event): void {
    event.preventDefault(); // Prevenir comportamiento por defecto del enlace
    this.isCoverModalOpen = true;
  }

  // Cerrar el modal perfil
  closeProfileModal(): void {
    this.isProfileModalOpen = false;
  }

  // Cerrar el modal portada
  closeCoverModal(): void {
    this.isCoverModalOpen = false;
  }

  handleProfilePhotoSelected(file: File): void {
    if (!this.haveProfilePicture) {
      this.profileService.createPhoto(file, this.profileId).subscribe({
        next: (response) => {
          this.currentProfilePhoto = URL.createObjectURL(file);
          this.profileService.setAvatarPhoto(this.currentProfilePhoto);
          this.profilePictureId = response;
          this.haveProfilePicture = true;
          this.closeProfileModal();
        },
        error: (error) => {
          // Error al enviar foto al servidor
        },
      });
    }
    else {
      this.profileService.updatePhoto(file, this.profilePictureId).subscribe({
        next: (response) => {
          this.currentProfilePhoto = URL.createObjectURL(file);
          this.profileService.setAvatarPhoto(this.currentProfilePhoto);
          this.closeProfileModal();
        },
        error: (error) => {
          // Error al enviar foto al servidor
        },
      });
    }
  }

  handleCoverPhotoSelected(file: File): void {
    if (!this.haveCoverPicture) {
      this.coverService.createPhoto(file, this.profileId).subscribe({
        next: (response) => {
          this.currentCoverPhoto = URL.createObjectURL(file);
          this.coverPictureId = response;
          this.haveCoverPicture = true;
          this.closeCoverModal();
        },
        error: (error) => {
          // Error al enviar foto al servidor
        },
      });
    }
    else {
      this.coverService.updatePhoto(file, this.coverPictureId).subscribe({
        next: (response) => {
          this.currentCoverPhoto = URL.createObjectURL(file);
          this.closeCoverModal();
        },
        error: (error) => {
          // Error al enviar foto al servidor
        },
      });
    }
  }

  deleteCoverPhotoSelected(coverPictureId: number): void {
    if (this.haveCoverPicture && this.userId != 0) {
      this.isLoading = true;
      this.coverService.deleteCoverPhoto(this.userId, coverPictureId).subscribe({
        next: (response) => {
          this.closeProfileModal();
          this.currentCoverPhoto = this.defaultPhoto;
          this.haveCoverPicture = false;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
        },
      });
    }
  }

  deleteProfilePhotoSelected(profilePictureId: number): void {
    if (this.haveProfilePicture && this.userId != 0) {
      this.isLoading = true;
      this.profileService.deleteProfilePhoto(this.userId, profilePictureId).subscribe({
        next: (response) => {
          this.closeProfileModal();
          this.currentProfilePhoto = this.defaultPhoto;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al enviar foto al servidor:', error);
          this.isLoading = false;
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
            this.userProfile = response;
          }),
          catchError((error) => {
            this.errorMessage = 'Error al obtener el perfil del usuario';
            throw error;
          })
        ).subscribe();
      }
    }
  }

  fetchProfilePhoto(): void {
    const userId = Number(this.profileId);
    if (!isNaN(userId)) {
      this.profileService.getProfilePhoto(userId).subscribe({
        next: (profilePicture: any) => {
          this.currentProfilePhoto = profilePicture.url_File;
          this.profilePictureId = profilePicture.id;

          if (this.isOwner) {
            this.profileService.setAvatarPhoto(this.currentProfilePhoto);
          }
          this.haveProfilePicture = true;
        },
        error: (error) => {
          this.errorMessage = 'No se pudo cargar la foto de perfil';
          this.currentProfilePhoto = this.defaultPhoto;
        },
      });
    }
  }

  fetchCoverPhoto(): void {
    this.isLoading = true;
    const userId = Number(this.profileId);
    if (!isNaN(userId)) {
      this.coverService.getCoverPhoto(userId).subscribe({
        next: (coverPicture: any) => {
          this.currentCoverPhoto = coverPicture.url_File;
          this.coverPictureId = coverPicture.id;
          this.haveCoverPicture = true;
          this.isLoading = false;
        },
        error: (error) => {
          this.haveCoverPicture = false;
          this.isLoading = false;
          console.error('Error al obtener la foto de portada:', error);
          this.errorMessage = 'No se pudo cargar la foto de portada';
        },
      });
    } else {
      console.error('El ID de usuario no es válido');
    }
  }

  getCurrentLoggedIdUser(): void {
    this.authService.getCurrentUserLogged().subscribe({
      next: (response: User) => {
        this.authService.CurrentUserLoggedId = response.id;
        this.senderId = response.id.toString(); // Asignar el id del usuario a senderId
        this.isLoading = false;
        this.userId = response.id
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al conseguir usuario logueado', error);
      },
    });
  }

  GetForeignProfileData(userId: number): void {
    this.userService.GetForeignProfileData(userId).subscribe({
      next: (response: ForeignProfileData) => {
        this.isFollowed = response.hasFollow;
        this.isSubscribed = response.hasSubscription
      },
      error: (error) => {
        console.error('Error al conseguir usuario logueado', error);
      },
    });
  }

  toggleFollow(): void {
    this.isFollowed = !this.isFollowed;
    this.followsService.updateFollowStatus(Number(this.profileId), this.isFollowed).subscribe({
      next: () => { },
      error: (error) => { }
    });
  }

  /*  toggleSubscribe(): void {
     this.isSubscribed = !this.isSubscribed;
     this.subscriptionsService.updateSubscribeStatus(Number(this.profileId), this.isSubscribed).subscribe({   //cambio la logica en la que se suscribe
       next: () => {},
       error: (error) => {}
     });
   } */

  loadPage() {
    this.isOwner = this.authService.isProfileOwner(this.profileId);
    if (!this.isOwner) {
      this.receiverId = this.profileId;
      this.GetForeignProfileData(Number(this.profileId));
    }
    this.fetchUserProfile();
    this.fetchProfilePhoto();
    this.fetchCoverPhoto();
    this.authService.setVisitedProfileId(Number(this.profileId));

    // Verificar si existe un plan
    this.planService.haveAnyPlan(Number(this.profileId)).subscribe({
      next: (hasPlan) => {
        this.hasPlan = hasPlan;
      },
      error: (error) => {
        console.error('Error al verificar el plan:', error);
      }
    });
  }

  openChat() {
    this.router.navigate(['/chat']);
    //this.isChatOpen = true;
  }

  closeChat() {
    this.isChatOpen = false;
  }

  async setChats() {
    try {
      const userJson = this.authService.getUserStorage();
      const user: User = JSON.parse(userJson); // Define el tipo si es posible  
      const timestamp = new Date(); // O usa Date.now() si prefieres un número

      await this.chatService.setChats(user.id.toString(), this.userProfile.id, this.userProfile.userName, user.userName, timestamp);

      this.router.navigate(['/chat'], {
        state: { otherUserName: this.userProfile.userName, otherUserId: this.userProfile.id.toString() }
      });

    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  }

  openCreatePlanModal(): void {
    this.isCreatePlanModalOpen = true;
  }

  closeCreatePlanModal(): void {
    this.isCreatePlanModalOpen = false;
  }

  handlePlanCreated(): void {
    this.hasPlan = true;
    this.closeCreatePlanModal();
  }
}