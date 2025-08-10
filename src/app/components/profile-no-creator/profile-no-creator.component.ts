import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserProfile } from 'src/app/models/userProfile';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserService } from 'src/app/services/user.service';
import { PurchasingInfo, PurchasedAlbum, ActiveSubscription } from 'src/app/models/purchasingInfo';

// Interfaz para el contenido comprado (usando datos reales)
interface PurchasedContent {
  id: number;
  title: string;
  creator: string;
  date: string;
  type: string;
  items: any[];
  isExpanded?: boolean;
}

@Component({
  selector: 'app-profile-no-creator',
  templateUrl: './profile-no-creator.component.html',
  styleUrls: ['./profile-no-creator.component.scss']
})
export class ProfileNoCreatorComponent implements OnInit {
  activeTab: string = 'purchased-content';

  profileId: string = ''; // ID del perfil visitado
  userId: number = 0; // ID del usuario actual
  isOwner: boolean = false; // Indica si el usuario actual es dueño del perfil

  userProfile: any = {}; // Para almacenar los datos del usuario
  errorMessage: string = ''; // Mensaje de error a mostrar

  isProfileModalOpen = false; // Control del estado del modal perfil

  defaultPhoto = 'assets/defaultIcons/defaultProfilePhoto.png';

  currentProfilePhoto = this.defaultPhoto; // URL de la foto actual
  profilePictureId: number = 0;  // ID de la foto actual

  private haveProfilePicture: boolean = false;
  isChatOpen = false;

  senderId = ''; // ID del usuario actual
  receiverId = ''; // ID del usuario con el que se desea chatear

  isLoading = false; // Estado de carga

  // Datos de contenido comprado (reales desde la API)
  purchasingInfo: PurchasingInfo = {};
  purchasedContent: PurchasedContent[] = [];

  constructor(
    private route: ActivatedRoute, 
    private authService: AuthService, 
    private userService: UserService, 
    private profileService: ProfileService,
    private router: Router,
    private chatService: ChatService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.getCurrentLoggedIdUser();
    this.profileId = this.route.snapshot.paramMap.get('id') || '';

    // Escuchar cambios en la URL
    this.route.paramMap.subscribe(params => {
      this.profileId = params.get('id') || ''; // Capturar el nuevo ID de la URL
      this.loadPage();
    });
  }

  // Abrir el modal perfil
  openProfileModal(event: Event): void {
    event.preventDefault(); // Prevenir comportamiento por defecto del enlace
    this.isProfileModalOpen = true;
  }

  // Cerrar el modal perfil
  closeProfileModal(): void {
    this.isProfileModalOpen = false;
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

  fetchPurchasingInfo(): void {
    this.userService.getPurchasingInfo().subscribe({
      next: (response: PurchasingInfo) => {
        this.purchasingInfo = response;
        this.transformPurchasingData();
      },
      error: (error) => {
        console.error('Error al obtener información de compras:', error);
        this.purchasedContent = [];
      }
    });
  }

  transformPurchasingData(): void {
    this.purchasedContent = [];

    // Transformar álbumes comprados
    if (this.purchasingInfo.purchasedAlbumsResponse && this.purchasingInfo.purchasedAlbumsResponse.length > 0) {
      this.purchasedContent.push({
        id: 1,
        title: 'Álbumes Comprados',
        creator: '',
        date: new Date().toISOString().split('T')[0],
        type: 'albums',
        items: this.purchasingInfo.purchasedAlbumsResponse.map((album: PurchasedAlbum) => ({
          name: album.albumResponse?.name || 'Álbum sin nombre',
          description: `${album.albumOwnerName || 'Creador'} - ${album.postCount || 0} fotos`,
          creatorId: album.albumResponse?.userId,
          creatorName: album.albumOwnerName,
          albumId: album.albumResponse?.id
        }))
      });
    }

    // Transformar suscripciones activas
    if (this.purchasingInfo.activeSubscriptionsResponse && this.purchasingInfo.activeSubscriptionsResponse.length > 0) {
      this.purchasedContent.push({
        id: 2,
        title: 'Suscripciones Activas',
        creator: '',
        date: new Date().toISOString().split('T')[0],
        type: 'subscriptions',
        items: this.purchasingInfo.activeSubscriptionsResponse.map((sub: ActiveSubscription) => ({
          name: sub.planOwnerName || 'Creador',
          description: 'Suscripción activa',
          creatorId: sub.planOwnerId,
          creatorName: sub.planOwnerName
        }))
      });
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

  loadPage() {
    this.isOwner = this.authService.isProfileOwner(this.profileId);
    if (!this.isOwner) {
      this.receiverId = this.profileId;
    }
    this.fetchUserProfile();
    this.fetchProfilePhoto();
    this.fetchPurchasingInfo();
    this.authService.setVisitedProfileId(Number(this.profileId));
  }

  openChat() {
    this.router.navigate(['/chat']);
  }

  closeChat() {
    this.isChatOpen = false;
  }

  async setChats() {
    try {
      const userJson = this.authService.getUserStorage();
      const user: User = JSON.parse(userJson);
      const timestamp = new Date();

      await this.chatService.setChats(user.id.toString(), this.userProfile.id, this.userProfile.userName, user.userName, timestamp);

      this.router.navigate(['/chat'], {
        state: { otherUserName: this.userProfile.userName, otherUserId: this.userProfile.id.toString() }
      });

    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  }

  // Métodos para manejar acordeones
  toggleAccordion(contentId: number): void {
    const content = this.purchasedContent.find(item => item.id === contentId);
    if (content) {
      content.isExpanded = !content.isExpanded;
    }
  }

  isAccordionExpanded(contentId: number): boolean {
    const content = this.purchasedContent.find(item => item.id === contentId);
    return content ? content.isExpanded || false : false;
  }

  // Navegar al perfil del creador
  navigateToCreatorProfile(creatorId: number): void {
    this.router.navigate(['/profile', creatorId]);
  }

  // Navegar al álbum
  navigateToAlbum(albumId: number): void {
    this.router.navigate(['/album', albumId]);
  }

  // Obtener foto del creador
  getCreatorPhoto(creatorId?: number): string {
    if (!creatorId) return 'assets/defaultIcons/defaultProfilePhoto.png';
    
    // Buscar si tenemos la foto del creador en las suscripciones activas
    if (this.purchasingInfo.activeSubscriptionsResponse) {
      const subscription = this.purchasingInfo.activeSubscriptionsResponse.find(sub => sub.planOwnerId === creatorId);
      if (subscription?.avatarUrl) {
        return subscription.avatarUrl;
      }
    }
    
    // Si no hay foto real, usar foto por defecto
    return 'assets/defaultIcons/defaultProfilePhoto.png';
  }


}
