import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserProfile } from 'src/app/models/userProfile';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserService } from 'src/app/services/user.service';

// Interfaz para el contenido comprado
interface PurchasedContentItem {
  name: string;
  description: string;
  creatorId?: number;
  creatorName?: string;
}

interface PurchasedContent {
  id: number;
  title: string;
  creator: string;
  date: string;
  type: string;
  items: PurchasedContentItem[];
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

  // Datos de contenido comprado (simulado)
  purchasedContent: PurchasedContent[] = [
    {
      id: 1,
      title: 'Albums Comprados',
      creator: '',
      date: '2024-01-15',
      type: 'albums',
      items: [
        { name: 'Album de Fotos Premium', description: 'Maria Garcia - 15 fotos', creatorId: 101, creatorName: 'Maria Garcia' },
        { name: 'Colección de Fotos', description: 'Ana Martinez - 20 fotos', creatorId: 102, creatorName: 'Ana Martinez' },
        { name: 'Album Especial', description: 'Carlos Rodriguez - 10 fotos', creatorId: 103, creatorName: 'Carlos Rodriguez' }
      ]
    },
    {
      id: 2,
      title: 'Suscripciones Activas',
      creator: '',
      date: '2024-01-10',
      type: 'subscriptions',
      items: [
        { name: 'Maria Garcia', description: 'Suscripción mensual activa', creatorId: 101, creatorName: 'Maria Garcia' },
        { name: 'Ana Martinez', description: 'Suscripción mensual activa', creatorId: 102, creatorName: 'Ana Martinez' }
      ]
    },
    {
      id: 3,
      title: 'Contenido Personalizado',
      creator: '',
      date: '2024-01-05',
      type: 'custom',
      items: [
        { name: 'Video Exclusivo', description: 'Video personalizado de 15 minutos', creatorId: 101, creatorName: 'Maria Garcia' },
        { name: 'Foto Personalizada', description: 'Foto especial solicitada', creatorId: 102, creatorName: 'Ana Martinez' },
        { name: 'Mensaje de Voz', description: 'Mensaje personalizado', creatorId: 103, creatorName: 'Carlos Rodriguez' }
      ]
    }
  ];

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

  // Obtener foto del creador (mock)
  getCreatorPhoto(creatorId?: number): string {
    if (!creatorId) return 'assets/defaultIcons/defaultProfilePhoto.png';
    
    // Array de fotos mock para diferentes creadores
    const creatorPhotos = [
      'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg',
      'https://images.pexels.com/photos/1642228/pexels-photo-1642228.jpeg',
      'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg',
      'https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg'
    ];
    
    // Usar el ID del creador para seleccionar una foto específica
    const photoIndex = creatorId % creatorPhotos.length;
    return creatorPhotos[photoIndex];
  }
}
