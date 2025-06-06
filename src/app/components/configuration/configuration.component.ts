import { Component, OnInit } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { ProfileData } from 'src/app/models/profileData';
import { UserProfile } from 'src/app/models/userProfile';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { TagService } from 'src/app/services/tag.service';
import { Tag } from 'src/app/models/tag';
import { SocialNetwork } from 'src/app/models/social-network';
import { BlockedUser } from 'src/app/models/blocked-user';
import { NavigationSection } from 'src/app/models/navigation-section';
import { PrivacySettings, PrivacySettingsResponse } from 'src/app/models/privacy-settings';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  // Propiedades de navegación
  public sidebarActive: boolean = false;
  public readonly sections: NavigationSection[] = [
    { id: 'profile', name: 'Datos Personales', icon: 'fa-user' },
    { id: 'tags', name: 'Etiquetas', icon: 'fa-tags' },
    { id: 'social', name: 'Redes Sociales', icon: 'fa-share-alt' },
    { id: 'privacy', name: 'Privacidad', icon: 'fa-lock' },
    { id: 'blocks', name: 'Usuarios Bloqueados', icon: 'fa-ban' },
    { id: 'account', name: 'Gestión de Cuenta', icon: 'fa-cog' }
  ];

  // Propiedades del perfil
  public userProfile: UserProfile = {} as UserProfile;
  public profileData: ProfileData = {
    id: 0,
    firstName: '',
    username: '',
    aboutMe: ''
  };

  // Propiedades de etiquetas
  public readonly maxTotalTags: number = 10;
  public availableTags: Tag[] = [];
  public selectedTags: Tag[] = [];
  public customTags: Tag[] = [];
  public newTagName: string = '';

  // Propiedades de privacidad y bloqueos
  public privacySettings: PrivacySettings = {
    userId: 0,
    enabledChat: false,
    receiveEmailNotifications: false
  };
  public blockedUsers: BlockedUser[] = [];

  // Propiedades de redes sociales
  public socialNetworks: SocialNetwork[] = [
    { platform: 'Instagram', url: '', icon: 'fa-instagram' },
    { platform: 'Twitter', url: '', icon: 'fa-twitter' },
    { platform: 'TikTok', url: '', icon: 'fa-tiktok' },
    { platform: 'YouTube', url: '', icon: 'fa-youtube' },
    { platform: 'OnlyFans', url: '', icon: 'fa-heart' }
  ];

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly tagService: TagService,
    private readonly configurationService: ConfigurationService
  ) { }

  // Métodos del ciclo de vida
  ngOnInit(): void {
    this.loadData();
  }

  // Métodos de carga de datos
  private loadData(): void {
    const userId = this.authService.getCurrentUserLoggedIdFromStorage();
    if (userId) {
      this.fetchUserProfile(userId);
      this.loadTags(userId);
    }
    
    this.initializeDefaultSettings();
  }

  private initializeDefaultSettings(): void {
    const userId = this.authService.getCurrentUserLoggedIdFromStorage();
    if (userId) {
      this.privacySettings = {
        userId: userId,
        enabledChat: false,
        receiveEmailNotifications: false
      };
      this.loadPrivacySettings();
    }

    this.blockedUsers = [
      new BlockedUser(1, '@usuario1', new Date('2024-01-01')),
      new BlockedUser(2, '@usuario2', new Date('2024-02-01'), 'Spam')
    ];
  }

  private loadPrivacySettings(): void {
    this.configurationService.getPrivacySettings().subscribe({
      next: (response: PrivacySettingsResponse) => {
        this.privacySettings.enabledChat = response.enabledChat;
        this.privacySettings.receiveEmailNotifications = response.receiveEmailNotifications;
      },
      error: (error: Error) => {
        console.error('Error al cargar la configuración de privacidad:', error);
      }
    });
  }

  private fetchUserProfile(userId: number): void {
    this.userService.getUserById(userId).pipe(
      tap((response: UserProfile) => {
        this.profileData = {
          id: response.id,
          firstName: response.firstName ?? '',
          username: response.userName ?? '',
          aboutMe: response.aboutMe ?? ''
        };

        // Actualizar redes sociales con la información del perfil
        this.socialNetworks = [
          { platform: 'Instagram', url: response.igSocialMedia ?? '', icon: 'fa-instagram' },
          { platform: 'Twitter', url: response.xSocialMedia ?? '', icon: 'fa-twitter' },
          { platform: 'TikTok', url: response.otherSocialMedia ?? '', icon: 'fa-tiktok' },
          { platform: 'YouTube', url: response.ytSocialMedia ?? '', icon: 'fa-youtube' },
          { platform: 'OnlyFans', url: response.otherSocialMedia ?? '', icon: 'fa-heart' }
        ];
      }),
      catchError((error) => {
        console.error('Error al cargar el perfil:', error);
        throw error;
      })
    ).subscribe();
  }

  private loadTags(userId: number): void {
    this.tagService.getAvailableTags().subscribe({
      next: (tags) => {
        this.availableTags = tags.map(tag => ({ ...tag, isSelected: false }));
        this.loadUserTags(userId);
      },
      error: (error) => {
        console.error('Error al cargar las etiquetas disponibles:', error);
      }
    });
  }

  private loadUserTags(userId: number): void {
    this.tagService.getUserTags(userId).subscribe({
      next: (userTags) => {
        this.selectedTags = userTags.filter(tag => !tag.isCustom);
        this.customTags = userTags.filter(tag => tag.isCustom);
        this.updateAvailableTagsSelection();
      },
      error: (error) => {
        console.error('Error al cargar las etiquetas del usuario:', error);
      }
    });
  }

  // Métodos de manejo de etiquetas
  public toggleTag(tag: Tag): void {
    const userId = this.authService.getCurrentUserLoggedIdFromStorage();
    if (!this.validateUserLogged(userId)) return;

    const totalSelectedTags = this.selectedTags.length + this.customTags.length;
    if (!this.validateTagLimit(tag, totalSelectedTags)) return;

    if (tag.isCustom) {
      this.handleCustomTagToggle(tag, userId);
    } else {
      this.handleDefaultTagToggle(tag, userId);
    }
  }

  private validateUserLogged(userId: number | null): boolean {
    if (!userId) {
      console.error('No hay usuario logueado');
      return false;
    }
    return true;
  }

  private validateTagLimit(tag: Tag, totalSelectedTags: number): boolean {
    if (!tag.isSelected && totalSelectedTags >= this.maxTotalTags) {
      alert(`Solo puedes tener un máximo de ${this.maxTotalTags} etiquetas en total`);
      return false;
    }
    return true;
  }

  private handleCustomTagToggle(tag: Tag, userId: number): void {
    if (tag.isSelected) {
      this.removeCustomTag(tag, userId);
    } else {
      this.addCustomTagToUser(tag, userId);
    }
  }

  private handleDefaultTagToggle(tag: Tag, userId: number): void {
    if (tag.isSelected) {
      this.removeDefaultTag(tag, userId);
    } else {
      this.addDefaultTagToUser(tag, userId);
    }
  }

  private removeCustomTag(tag: Tag, userId: number): void {
    this.tagService.removeTagFromUser(userId, tag.id).subscribe({
      next: () => {
        this.customTags = this.customTags.filter(t => t.id !== tag.id);
        tag.usageCount--;
      },
      error: (error) => {
        console.error('Error al remover la etiqueta personalizada:', error);
        alert('Error al remover la etiqueta. Por favor, intente nuevamente.');
      }
    });
  }

  private addCustomTagToUser(tag: Tag, userId: number): void {
    this.tagService.addTagToUser(tag.id).subscribe({
      next: () => {
        this.customTags.push(tag);
        tag.usageCount++;
      },
      error: (error) => {
        console.error('Error al agregar la etiqueta personalizada:', error);
        alert('Error al agregar la etiqueta. Por favor, intente nuevamente.');
      }
    });
  }

  private removeDefaultTag(tag: Tag, userId: number): void {
    this.tagService.removeTagFromUser(userId, tag.id).subscribe({
      next: () => {
        this.selectedTags = this.selectedTags.filter(t => t.id !== tag.id);
        tag.isSelected = false;
        const index = this.availableTags.findIndex(t => t.id === tag.id);
        if (index !== -1) {
          this.availableTags[index].usageCount--;
        }
      },
      error: (error) => {
        console.error('Error al remover la etiqueta:', error);
        alert('Error al remover la etiqueta. Por favor, intente nuevamente.');
      }
    });
  }

  private addDefaultTagToUser(tag: Tag, userId: number): void {
    this.tagService.addTagToUser(tag.id).subscribe({
      next: () => {
        this.selectedTags.push(tag);
        tag.isSelected = true;
        tag.usageCount++;
      },
      error: (error) => {
        console.error('Error al agregar la etiqueta:', error);
        alert('Error al agregar la etiqueta. Por favor, intente nuevamente.');
      }
    });
  }

  updateAvailableTagsSelection(): void {
    this.availableTags.forEach(tag => {
      tag.isSelected = this.selectedTags.some(t => t.id === tag.id);
    });
  }

  addCustomTag(): void {
    const userId = this.authService.getCurrentUserLoggedIdFromStorage();
    if (!userId) {
      console.error('No hay usuario logueado');
      return;
    }

    if (this.selectedTags.length + this.customTags.length >= this.maxTotalTags) {
      alert(`Solo puedes tener un máximo de ${this.maxTotalTags} etiquetas en total`);
      return;
    }
    if (this.newTagName.trim()) {
      this.tagService.createCustomTag(this.newTagName.trim()).subscribe({
        next: (tagId) => {
          const newTag: Tag = {
            id: tagId,
            name: this.newTagName.trim(),
            isCustom: true,
            usageCount: 1,
            isSelected: true
          };
          this.customTags.push(newTag);
          this.newTagName = '';
        },
        error: (error) => {
          console.error('Error al crear la etiqueta personalizada:', error);
          alert('Error al crear la etiqueta. Por favor, intente nuevamente.');
        }
      });
    }
  }

  removeTag(tag: Tag): void {
    const userId = this.authService.getCurrentUserLoggedIdFromStorage();
    if (!userId) {
      console.error('No hay usuario logueado');
      return;
    }

    this.tagService.removeTagFromUser(userId, tag.id).subscribe({
      next: () => {
        if (tag.isCustom) {
          this.customTags = this.customTags.filter(t => t.id !== tag.id);
        } else {
          this.selectedTags = this.selectedTags.filter(t => t.id !== tag.id);
          const availableTag = this.availableTags.find(t => t.id === tag.id);
          if (availableTag) {
            availableTag.isSelected = false;
          }
          const index = this.availableTags.findIndex(t => t.id === tag.id);
          if (index !== -1) {
            this.availableTags[index].usageCount--;
          }
        }
      },
      error: (error) => {
        console.error('Error al remover la etiqueta:', error);
        alert('Error al remover la etiqueta. Por favor, intente nuevamente.');
      }
    });
  }

  toggleSidebar(): void {
    this.sidebarActive = !this.sidebarActive;
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      if (window.innerWidth <= 768) {
        this.toggleSidebar();
      }
    }
  }

  updateSocialNetwork(platform: string, url: string): void {
    const network = this.socialNetworks.find(n => n.platform === platform);
    if (network) {
      network.url = url;
      
      // Actualizar el perfil en el backend
      const userProfile: UserProfile = {
        id: this.profileData.id,
        igSocialMedia: platform === 'Instagram' ? url : this.socialNetworks.find(n => n.platform === 'Instagram')?.url ?? '',
        xSocialMedia: platform === 'Twitter' ? url : this.socialNetworks.find(n => n.platform === 'Twitter')?.url ?? '',
        ytSocialMedia: platform === 'YouTube' ? url : this.socialNetworks.find(n => n.platform === 'YouTube')?.url ?? '',
        otherSocialMedia: platform === 'TikTok' || platform === 'OnlyFans' ? url : this.socialNetworks.find(n => n.platform === 'TikTok')?.url ?? ''
      };

      this.userService.updateUser(userProfile).subscribe({
        next: () => {
          console.log('Red social actualizada exitosamente');
        },
        error: (error) => {
          console.error('Error al actualizar la red social:', error);
          alert('Error al actualizar la red social. Por favor, intente nuevamente.');
          // Revertir el cambio local si falla la actualización
          network.url = this.socialNetworks.find(n => n.platform === platform)?.url ?? '';
        }
      });
    }
  }

  blockUser(username: string, reason?: string): void {
    const newBlock = new BlockedUser(
      Date.now(),
      username,
      new Date(),
      reason
    );
    this.blockedUsers.push(newBlock);
  }

  unblockUser(userId: number): void {
    this.blockedUsers = this.blockedUsers.filter(user => user.id !== userId);
  }

  deleteAccount(): void {
    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      console.log('Cuenta eliminada');
    }
  }

  saveProfile(): void {
    const userProfile: UserProfile = {
      id: this.profileData.id,
      firstName: this.profileData.firstName,
      userName: this.profileData.username,
      aboutMe: this.profileData.aboutMe
    };

    this.userService.updateUser(userProfile).subscribe({
      next: () => {
        console.log('Perfil actualizado exitosamente');
        alert('¡Perfil actualizado exitosamente!');
      },
      error: (error) => {
        console.error('Error al actualizar el perfil:', error);
        alert('Error al actualizar el perfil. Por favor, intente nuevamente.');
      }
    });
  }

  togglePrivacySetting(setting: 'enabledChat' | 'receiveEmailNotifications'): void {
    const userId = this.authService.getCurrentUserLoggedIdFromStorage();
    if (!userId) {
      console.error('No hay usuario logueado');
      return;
    }

    const newValue = this.privacySettings[setting];

    const request = {
      userId: userId,
      [setting]: newValue
    };

    if (setting === 'enabledChat') {
      this.configurationService.toggleChat(request).subscribe({
        next: () => {
          this.privacySettings.enabledChat = newValue;
          console.log('Configuración de chat actualizada:', this.privacySettings.enabledChat);
        },
        error: (error: Error) => {
          console.error('Error al actualizar la configuración de chat:', error);
        }
      });
    } else {
      this.configurationService.toggleEmailNotifications(request).subscribe({
        next: () => {
          this.privacySettings.receiveEmailNotifications = newValue;
          console.log('Configuración de notificaciones actualizada:', this.privacySettings.receiveEmailNotifications);
        },
        error: (error: Error) => {
          console.error('Error al actualizar la configuración de notificaciones:', error);
        }
      });
    }
  }
}
