import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { ProfileData } from 'src/app/models/profileData';
import { UserProfile } from 'src/app/models/userProfile';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { TagService, Tag } from 'src/app/services/tag.service';

interface SocialNetwork {
  platform: string;
  url: string;
}

interface BlockedUser {
  id: number;
  username: string;
  blockedDate: Date;
  reason?: string;
}

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {  
  sidebarActive: boolean = false;

  userProfile: UserProfile = {} as UserProfile; // Para almacenar los datos del usuario

  
  // Secciones de navegación
  sections = [
    { id: 'profile', name: 'Perfil' },
    { id: 'tags', name: 'Etiquetas' },
    { id: 'social', name: 'Redes Sociales' },
    { id: 'privacy', name: 'Privacidad' },
    { id: 'blocks', name: 'Bloqueos' },
    { id: 'account', name: 'Cuenta' }
  ];

  // Datos del perfil
  profileData: ProfileData = {
    id: 0,
    firstName: '',
    username: '',
    aboutMe: ''
  };

  // Configuración de privacidad
  privacySettings = {
    chatEnabled: true,
    emailNotifications: true
  };

  // Etiquetas
  availableTags: Tag[] = [
    { id: 1, name: 'Fotografía', isCustom: false, usageCount: 150, isSelected: false },
    { id: 2, name: 'Arte', isCustom: false, usageCount: 120, isSelected: false },
    { id: 3, name: 'Música', isCustom: false, usageCount: 90, isSelected: false },
    { id: 4, name: 'Diseño', isCustom: false, usageCount: 85, isSelected: false },
    { id: 5, name: 'Moda', isCustom: false, usageCount: 75, isSelected: false },
    { id: 6, name: 'Baile', isCustom: false, usageCount: 65, isSelected: false },
    { id: 7, name: 'Cine', isCustom: false, usageCount: 60, isSelected: false },
    { id: 8, name: 'Literatura', isCustom: false, usageCount: 55, isSelected: false },
    { id: 9, name: 'Deportes', isCustom: false, usageCount: 50, isSelected: false },
    { id: 10, name: 'Gaming', isCustom: false, usageCount: 45, isSelected: false }
  ];
  selectedTags: Tag[] = [];
  customTags: Tag[] = [];
  maxTotalTags: number = 10;
  newTagName: string = '';

  // Redes sociales (simplificadas)
  socialNetworks: SocialNetwork[] = [
    { platform: 'Instagram', url: '' },
    { platform: 'Twitter', url: '' },
    { platform: 'TikTok', url: '' },
    { platform: 'YouTube', url: '' },
    { platform: 'OnlyFans', url: '' }
  ];

  // Usuarios bloqueados
  blockedUsers: BlockedUser[] = [];

  constructor(
    private userService: UserService, 
    private authService: AuthService,
    private tagService: TagService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  fetchUserProfile(userId: number): void {
    this.userService.getUserById(userId).pipe(
      tap((response: UserProfile) => {
        this.profileData = {
          id: response.id,
          firstName: response.firstName,
          username: response.userName,
          aboutMe: response.aboutMe
        };
      }),
      catchError((error) => {
        throw error;
      })
    ).subscribe();
  }

  loadData(): void {
    var userId = this.authService.getCurrentUserLoggedIdFromStorage();
    if (userId) {
      this.fetchUserProfile(userId);
      this.loadTags(userId);
    }  
    
    this.privacySettings = {
      chatEnabled: true,
      emailNotifications: true
    };

    this.blockedUsers = [
      { id: 1, username: '@usuario1', blockedDate: new Date('2024-01-01') },
      { id: 2, username: '@usuario2', blockedDate: new Date('2024-02-01'), reason: 'Spam' }
    ];
  }

  loadTags(userId: number): void {
    // Cargar etiquetas disponibles
    this.tagService.getAvailableTags().subscribe({
      next: (tags) => {
        this.availableTags = tags.map(tag => ({ ...tag, isSelected: false }));
        // Cargar etiquetas del usuario
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
      },
      error: (error) => {
        console.error('Error al cargar las etiquetas disponibles:', error);
      }
    });
  }

  updateAvailableTagsSelection(): void {
    this.availableTags.forEach(tag => {
      tag.isSelected = this.selectedTags.some(t => t.id === tag.id);
    });
  }

  toggleTag(tag: Tag): void {
    const totalSelectedTags = this.selectedTags.length + this.customTags.length;
    const userId = this.authService.getCurrentUserLoggedIdFromStorage();    
    if (!userId) {

      console.error('No hay usuario logueado');
      return;
    }
    
    if (!tag.isSelected && totalSelectedTags >= this.maxTotalTags) {
      alert(`Solo puedes tener un máximo de ${this.maxTotalTags} etiquetas en total`);
      return;
    }

    if (tag.isCustom) {
      // Manejar etiquetas personalizadas
      if (tag.isSelected) {
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
      } else {
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
    } else {
      // Manejar etiquetas predeterminadas
      if (tag.isSelected) {
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
      } else {
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
    }
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
      this.tagService.createCustomTag( this.newTagName.trim()).subscribe({
        next: (newTag) => {
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
    }
  }

  blockUser(username: string, reason?: string): void {
    const newBlock: BlockedUser = {
      id: Date.now(),
      username,
      blockedDate: new Date(),
      reason
    };
    this.blockedUsers.push(newBlock);
  }

  unblockUser(userId: number): void {
    this.blockedUsers = this.blockedUsers.filter(user => user.id !== userId);
  }

  deleteAccount(): void {
    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      // Aquí iría la lógica para eliminar la cuenta
      console.log('Cuenta eliminada');
    }
  }

  saveProfile(): void {
    this.userService.updateUser(this.profileData).subscribe({
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

  togglePrivacySetting(setting: 'chatEnabled' | 'emailNotifications'): void {
    this.privacySettings[setting] = !this.privacySettings[setting];
    // Aquí iría la lógica para guardar la configuración
    console.log('Configuración de privacidad actualizada:', this.privacySettings);
  }
}
