import { Component, OnInit } from '@angular/core';

interface Tag {
  id: number;
  name: string;
  isCustom: boolean;
  usageCount?: number;
  isSelected?: boolean;
}

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

interface ProfileData {
  name: string;
  username: string;
  aboutMe: string;
}

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  sidebarActive: boolean = false;
  
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
    name: '',
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

  constructor() { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Aquí se cargarían los datos reales del servicio
    this.profileData = {
      name: 'Usuario Ejemplo',
      username: '@usuario',
      aboutMe: 'Descripción del perfil...'
    };

    this.privacySettings = {
      chatEnabled: true,
      emailNotifications: true
    };

    // Cargar etiquetas seleccionadas (ejemplo)
    this.selectedTags = [
      { id: 1, name: 'Fotografía', isCustom: false, usageCount: 150, isSelected: true },
      { id: 3, name: 'Música', isCustom: false, usageCount: 90, isSelected: true }
    ];

    this.customTags = [
      { id: 11, name: 'Mi Etiqueta 1', isCustom: true, usageCount: 45, isSelected: true },
      { id: 12, name: 'Mi Etiqueta 2', isCustom: true, usageCount: 30, isSelected: true }
    ];

    // Actualizar estado de selección en availableTags
    this.updateAvailableTagsSelection();

    this.blockedUsers = [
      { id: 1, username: '@usuario1', blockedDate: new Date('2024-01-01') },
      { id: 2, username: '@usuario2', blockedDate: new Date('2024-02-01'), reason: 'Spam' }
    ];
  }

  updateAvailableTagsSelection(): void {
    this.availableTags.forEach(tag => {
      tag.isSelected = this.selectedTags.some(t => t.id === tag.id);
    });
  }

  toggleTag(tag: Tag): void {
    const totalSelectedTags = this.selectedTags.length + this.customTags.length;
    
    if (!tag.isSelected && totalSelectedTags >= this.maxTotalTags) {
      alert(`Solo puedes tener un máximo de ${this.maxTotalTags} etiquetas en total`);
      return;
    }

    if (tag.isCustom) {
      // Manejar etiquetas personalizadas
      if (tag.isSelected) {
        this.customTags = this.customTags.filter(t => t.id !== tag.id);
      } else {
        this.customTags.push(tag);
      }
    } else {
      // Manejar etiquetas predeterminadas
      if (tag.isSelected) {
        this.selectedTags = this.selectedTags.filter(t => t.id !== tag.id);
      } else {
        this.selectedTags.push(tag);
      }
      tag.isSelected = !tag.isSelected;
    }
  }

  addCustomTag(): void {
    if (this.selectedTags.length + this.customTags.length >= this.maxTotalTags) {
      alert(`Solo puedes tener un máximo de ${this.maxTotalTags} etiquetas en total`);
      return;
    }

    if (this.newTagName.trim()) {
      const newTag: Tag = {
        id: Date.now(),
        name: this.newTagName.trim(),
        isCustom: true,
        usageCount: 0,
        isSelected: true
      };
      this.customTags.push(newTag);
      this.newTagName = '';
    }
  }

  removeTag(tag: Tag): void {
    if (tag.isCustom) {
      this.customTags = this.customTags.filter(t => t.id !== tag.id);
    } else {
      this.selectedTags = this.selectedTags.filter(t => t.id !== tag.id);
      const availableTag = this.availableTags.find(t => t.id === tag.id);
      if (availableTag) {
        availableTag.isSelected = false;
      }
    }
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
    // Aquí iría la lógica para guardar los cambios del perfil
    console.log('Perfil guardado', this.profileData);
  }

  togglePrivacySetting(setting: 'chatEnabled' | 'emailNotifications'): void {
    this.privacySettings[setting] = !this.privacySettings[setting];
    // Aquí iría la lógica para guardar la configuración
    console.log('Configuración de privacidad actualizada:', this.privacySettings);
  }
}
