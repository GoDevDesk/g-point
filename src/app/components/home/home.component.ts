import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { ProfileService } from '../../services/profile.service';
import { ChatService } from '../../services/chat.service';
import { Post } from '../../models/Post';
import { UserProfile } from '../../models/userProfile';
import { ProfilePicture } from '../../models/profilePicture';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

interface PostWithUser extends Post {
  userProfile?: UserProfile;
  profilePicture?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  posts: PostWithUser[] = [];
  filteredPosts: PostWithUser[] = [];
  loading = false;
  currentPage = 1;
  hasMorePosts = true;

  // Filtros y búsqueda
  searchTerm = '';
  selectedTags: string[] = [];
  customTags: string[] = [];
  maxFilters = 20;
  showLimitMessage = false;

  // Tags más populares (basados en el contenido mockeado)
  popularTags = [
    { tag: 'fotografia', count: 3 },
    { tag: 'arte', count: 2 },
    { tag: 'fitness', count: 3 },
    { tag: 'modelaje', count: 1 },
    { tag: 'verano', count: 1 },
    { tag: 'salud', count: 2 },
    { tag: 'conceptual', count: 1 },
    { tag: 'bienestar', count: 1 },
    { tag: 'lifestyle', count: 1 },
    { tag: 'principiantes', count: 1 },
    { tag: 'motivacion', count: 1 }
  ];

  // Datos mockeados
  private mockPosts: PostWithUser[] = [
    {
      id: 1,
      userId: 1,
      albumId: 1,
      upload_Date: new Date(Date.now() - 1800000), // 30 minutos atrás
      url_File: 'assets/iaModels/1.jpg',
      description: 'Nueva sesión fotográfica con un toque artístico y sensual. ✨ #fotografia #arte #modelaje',
      contentType: 'image/jpeg',
      currentUserData: null,
      userProfile: {
        id: 1,
        userName: 'maria_garcia',
        firstName: 'María',
        lastName: 'García',
        followersCount: 1250,
        followsCount: 89,
        postssCount: 45
      },
      profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png'
    },
    {
      id: 2,
      userId: 2,
      albumId: 1,
      upload_Date: new Date(Date.now() - 3600000), // 1 hora atrás
      url_File: 'assets/iaModels/2.jpeg',
      description: 'Rutina de ejercicios especial para el verano. 💪 Mantente en forma y saludable. #fitness #verano #salud',
      contentType: 'image/jpeg',
      currentUserData: null,
      userProfile: {
        id: 2,
        userName: 'ana_martinez',
        firstName: 'Ana',
        lastName: 'Martínez',
        followersCount: 890,
        followsCount: 156,
        postssCount: 32
      },
      profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png'
    },
    {
      id: 3,
      userId: 3,
      albumId: 1,
      upload_Date: new Date(Date.now() - 7200000), // 2 horas atrás
      url_File: 'assets/iaModels/3.jpeg',
      description: 'Nueva serie de fotografías conceptuales. 🎨 Cada imagen cuenta una historia única. #conceptual #arte #fotografia',
      contentType: 'image/jpeg',
      currentUserData: null,
      userProfile: {
        id: 3,
        userName: 'laura_sanchez',
        firstName: 'Laura',
        lastName: 'Sánchez',
        followersCount: 2100,
        followsCount: 234,
        postssCount: 78
      },
      profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png'
    },
    {
      id: 4,
      userId: 4,
      albumId: 1,
      upload_Date: new Date(Date.now() - 10800000), // 3 horas atrás
      url_File: 'assets/iaModels/images.jpeg',
      description: 'Creadora de contenido fitness y bienestar. 🌟 Compartiendo mi pasión por una vida saludable. #fitness #bienestar #lifestyle',
      contentType: 'image/jpeg',
      currentUserData: null,
      userProfile: {
        id: 4,
        userName: 'sofia_rodriguez',
        firstName: 'Sofía',
        lastName: 'Rodríguez',
        followersCount: 1560,
        followsCount: 89,
        postssCount: 56
      },
      profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png'
    },
    {
      id: 5,
      userId: 5,
      albumId: 1,
      upload_Date: new Date(Date.now() - 14400000), // 4 horas atrás
      url_File: 'assets/iaModels/images (1).jpeg',
      description: 'Nueva rutina de ejercicios para principiantes. 💪 Perfecta para empezar tu transformación. #principiantes #fitness #motivacion',
      contentType: 'image/jpeg',
      currentUserData: null,
      userProfile: {
        id: 5,
        userName: 'carla_lopez',
        firstName: 'Carla',
        lastName: 'López',
        followersCount: 980,
        followsCount: 145,
        postssCount: 28
      },
      profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png'
    }
  ];

  constructor(
    private postService: PostService,
    private userService: UserService,
    private profileService: ProfileService,
    private chatService: ChatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Cargar datos mockeados inmediatamente
    this.loadMockPosts();
  }

  loadMockPosts(): void {
    this.loading = true;
    
    // Simular delay de red
    setTimeout(() => {
      this.posts = [...this.mockPosts];
      this.filterPosts();
      this.loading = false;
      this.hasMorePosts = false; // No hay más posts mockeados
    }, 500);
  }

  // Métodos de filtrado
  onSearchChange(): void {
    // No filtrar automáticamente, solo agregar tag cuando se presiona Enter
  }

  addCustomTag(): void {
    const tag = this.searchTerm.trim().toLowerCase();
    if (tag && !this.customTags.includes(tag) && !this.selectedTags.includes(tag)) {
      if (this.selectedTags.length >= this.maxFilters) {
        this.showLimitMessage = true;
        setTimeout(() => {
          this.showLimitMessage = false;
        }, 3000);
        return;
      }
      
      this.customTags.push(tag);
      this.selectedTags.push(tag);
      this.searchTerm = '';
      this.filterPosts();
    }
  }

  onSearchKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.addCustomTag();
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
  }

  toggleTag(tag: string): void {
    const index = this.selectedTags.indexOf(tag);
    if (index > -1) {
      this.selectedTags.splice(index, 1);
      // También remover de customTags si existe
      const customIndex = this.customTags.indexOf(tag);
      if (customIndex > -1) {
        this.customTags.splice(customIndex, 1);
      }
    } else {
      if (this.selectedTags.length >= this.maxFilters) {
        this.showLimitMessage = true;
        setTimeout(() => {
          this.showLimitMessage = false;
        }, 3000);
        return;
      }
      this.selectedTags.push(tag);
    }
    this.filterPosts();
  }

  removeTag(tag: string): void {
    const index = this.selectedTags.indexOf(tag);
    if (index > -1) {
      this.selectedTags.splice(index, 1);
      // También remover de customTags si existe
      const customIndex = this.customTags.indexOf(tag);
      if (customIndex > -1) {
        this.customTags.splice(customIndex, 1);
      }
      this.filterPosts();
    }
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.selectedTags = [];
    this.customTags = [];
    this.filterPosts();
  }

  filterPosts(): void {
    let filtered = [...this.posts];

    // Filtrar por tags seleccionados (tanto predefinidos como personalizados)
    if (this.selectedTags.length > 0) {
      filtered = filtered.filter(post => {
        const postText = post.description?.toLowerCase() || '';
        return this.selectedTags.some(tag => 
          postText.includes(tag.toLowerCase())
        );
      });
    }

    this.filteredPosts = filtered;
  }

  loadPosts(): void {
    if (!this.hasMorePosts || this.loading) return;

    this.loading = true;
    
    // Simular carga de datos
    setTimeout(() => {
      const startIndex = (this.currentPage - 1) * 3;
      const endIndex = startIndex + 3;
      const newPosts = this.mockPosts.slice(startIndex, endIndex);
      
      if (newPosts.length > 0) {
        this.posts = [...this.posts, ...newPosts];
        this.currentPage++;
        this.hasMorePosts = endIndex < this.mockPosts.length;
        this.filterPosts(); // Re-aplicar filtros
      } else {
        this.hasMorePosts = false;
      }
      
      this.loading = false;
    }, 1000); // Simular delay de red
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Cargar más posts cuando el usuario esté cerca del final
    if (windowHeight + scrollTop >= documentHeight - 100) {
      this.loadPosts();
    }
  }

  viewProfile(userId: number): void {
    this.router.navigate(['/profile', userId]);
  }

  sendMessage(userId: number, userName: string): void {
    // Obtener el ID del usuario actual desde localStorage
    const currentUserId = localStorage.getItem('userId');
    if (currentUserId) {
      // Inicializar el chat y navegar a la página de chat
      this.chatService.setChats(
        currentUserId,
        userId.toString(),
        userName,
        'Usuario Actual', // Esto debería ser el nombre del usuario actual
        new Date()
      ).then(() => {
        this.router.navigate(['/chat']);
      });
    }
  }

  formatDate(date: Date): string {
    const now = new Date();
    const postDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMinutes < 1) {
      return 'Ahora mismo';
    } else if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} min`;
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours}h`;
    } else if (diffInDays < 7) {
      return `Hace ${diffInDays}d`;
    } else {
      return postDate.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/defaultIcons/defaultProfilePhoto.png';
    }
  }
}
