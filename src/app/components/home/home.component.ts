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

  // Array con todas las imágenes disponibles de iaModels (solo las que realmente existen)
  private iaModelImages = [
    'assets/iaModels/1.jpeg',
    'assets/iaModels/2.jpeg',
    'assets/iaModels/cliente-feliz.jpg',
    'assets/iaModels/4.jpeg',
    'assets/iaModels/5.jpeg',
    'assets/iaModels/paula.jpg',
    'assets/iaModels/laura.jpg',
    'assets/iaModels/melisa.jpg',
    'assets/iaModels/iara.jpg',
    'assets/iaModels/routh.jpg'
  ];

  // Datos mockeados usando todas las imágenes disponibles
  private mockPosts: PostWithUser[] = [
    {
      id: 1,
      userId: 1,
      albumId: 1,
      upload_Date: new Date(Date.now() - 1800000), // 30 minutos atrás
             url_File: 'assets/iaModels/1.jpeg',
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
               url_File: 'assets/iaModels/cliente-feliz.jpg',
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
       url_File: 'assets/iaModels/4.jpeg',
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
       url_File: 'assets/iaModels/5.jpeg',
      description: 'Nueva rutina de ejercicios para principiantes. 💪 Perfecta para empezar tu transformación. #principiantes #fitness #motivacion',
      contentType: 'image/jpeg',
      currentUserData: null,
      userProfile: {
        isCreator: true,
        id: 5,
        userName: 'carla_lopez',
        firstName: 'Carla',
        lastName: 'López',
        followersCount: 980,
        followsCount: 145,
        postssCount: 28
      },
      profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png'
    },
         {
       id: 6,
       userId: 6,
       albumId: 1,
       upload_Date: new Date(Date.now() - 18000000), // 5 horas atrás
       url_File: 'assets/iaModels/1.jpeg',
      description: 'Sesión fotográfica profesional con iluminación natural. 📸 La belleza está en los detalles. #fotografia #profesional #arte',
      contentType: 'image/jpeg',
      currentUserData: null,
      userProfile: {
        id: 6,
        userName: 'elena_vargas',
        firstName: 'Elena',
        lastName: 'Vargas',
        followersCount: 2100,
        followsCount: 189,
        postssCount: 67
      },
      profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png'
    },
    {
      id: 7,
      userId: 7,
      albumId: 1,
      upload_Date: new Date(Date.now() - 21600000), // 6 horas atrás
             url_File: 'assets/iaModels/2.jpeg',
      description: 'Contenido exclusivo y elegante. 💎 Cada foto cuenta una historia diferente. #exclusivo #elegante #contenido',
      contentType: 'image/jpeg',
      currentUserData: null,
      userProfile: {
        id: 7,
        userName: 'isabella_torres',
        firstName: 'Isabella',
        lastName: 'Torres',
        followersCount: 3200,
        followsCount: 245,
        postssCount: 89
      },
      profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png'
    },
    {
      id: 8,
      userId: 8,
      albumId: 1,
      upload_Date: new Date(Date.now() - 25200000), // 7 horas atrás
             url_File: 'assets/iaModels/paula.jpg',
      description: 'Nueva colección de fotos artísticas. 🎭 La creatividad no tiene límites. #artistico #creatividad #fotografia',
      contentType: 'image/jpeg',
      currentUserData: null,
      userProfile: {
        id: 8,
        userName: 'valentina_ruiz',
        firstName: 'Valentina',
        lastName: 'Ruiz',
        followersCount: 1800,
        followsCount: 167,
        postssCount: 45
      },
      profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png'
    },
    {
      id: 9,
      userId: 9,
      albumId: 1,
      upload_Date: new Date(Date.now() - 28800000), // 8 horas atrás
             url_File: 'assets/iaModels/4.jpeg',
      description: 'Sesión casual y natural. 🌸 La belleza auténtica brilla por sí sola. #natural #casual #belleza',
      contentType: 'image/jpeg',
      currentUserData: null,
      userProfile: {
        id: 9,
        userName: 'camila_herrera',
        firstName: 'Camila',
        lastName: 'Herrera',
        followersCount: 1450,
        followsCount: 123,
        postssCount: 38
      },
      profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png'
    },
    {
      id: 10,
      userId: 10,
      albumId: 1,
      upload_Date: new Date(Date.now() - 32400000), // 9 horas atrás
             url_File: 'assets/iaModels/5.jpeg',
      description: 'Fotografía de estilo urbano y moderno. 🏙️ La ciudad como escenario perfecto. #urbano #moderno #estilo',
      contentType: 'image/jpeg',
      currentUserData: null,
      userProfile: {
        id: 10,
        userName: 'daniela_morales',
        firstName: 'Daniela',
        lastName: 'Morales',
        followersCount: 2200,
        followsCount: 198,
        postssCount: 72
      },
      profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png'
    },
    {
      id: 11,
      userId: 11,
      albumId: 1,
      upload_Date: new Date(Date.now() - 36000000), // 10 horas atrás
             url_File: 'assets/iaModels/1.jpeg',
      description: 'Momentos de felicidad capturados. 😊 La alegría es contagiosa. #felicidad #alegria #momentos',
      contentType: 'image/jpeg',
      currentUserData: null,
      userProfile: {
        id: 11,
        userName: 'lucia_gonzalez',
        firstName: 'Lucía',
        lastName: 'González',
        followersCount: 1680,
        followsCount: 145,
        postssCount: 51
      },
      profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png'
    },
    {
      id: 12,
      userId: 12,
      albumId: 1,
      upload_Date: new Date(Date.now() - 39600000), // 11 horas atrás
             url_File: 'assets/iaModels/2.jpeg',
      description: 'Confianza y seguridad en cada pose. 💪 Empoderamiento femenino. #confianza #empoderamiento #seguridad',
      contentType: 'image/jpeg',
      currentUserData: null,
      userProfile: {
        id: 12,
        userName: 'yuki_tanaka',
        firstName: 'Yuki',
        lastName: 'Tanaka',
        followersCount: 2800,
        followsCount: 234,
        postssCount: 83
      },
      profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png'
    },
    {
      id: 13,
      userId: 13,
      albumId: 1,
      upload_Date: new Date(Date.now() - 43200000), // 12 horas atrás
             url_File: 'assets/iaModels/laura.jpg',
      description: 'Tecnología y estilo se encuentran. 📱 La vida digital nunca fue tan elegante. #tecnologia #estilo #digital',
      contentType: 'image/jpeg',
      currentUserData: null,
      userProfile: {
        id: 13,
        userName: 'sofia_kim',
        firstName: 'Sofía',
        lastName: 'Kim',
        followersCount: 1950,
        followsCount: 178,
        postssCount: 62
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

  // Método para cargar más posts (scroll infinito)
  loadMorePosts(): void {
    if (this.loading || !this.hasMorePosts) return;
    
    this.loading = true;
    
    // Simular delay de red
    setTimeout(() => {
      const additionalPosts = this.generateAdditionalPosts();
      this.posts = [...this.posts, ...additionalPosts];
      this.filterPosts();
      this.loading = false;
      
      // Simular que eventualmente no hay más posts
      if (this.posts.length > 50) {
        this.hasMorePosts = false;
      }
    }, 1000);
  }

  loadMockPosts(): void {
    this.loading = true;
    
    // Simular delay de red
    setTimeout(() => {
      this.posts = [...this.mockPosts];
      this.filterPosts();
      this.loading = false;
      this.hasMorePosts = true; // Ahora tenemos más posts disponibles
    }, 500);
  }

  // Método para generar posts adicionales dinámicamente
  generateAdditionalPosts(): PostWithUser[] {
    const additionalPosts: PostWithUser[] = [];
    const userNames = [
      'alexandra_reyes', 'mariana_ortiz', 'catalina_silva', 'gabriela_mendez',
      'valeria_castro', 'adriana_rios', 'natalia_vega', 'paula_jimenez'
    ];
    
    // Generar 5 posts adicionales usando solo las imágenes que realmente existen en iaModels
    for (let i = 0; i < 5; i++) {
      const randomImageIndex = Math.floor(Math.random() * this.iaModelImages.length);
      const randomUserNameIndex = Math.floor(Math.random() * userNames.length);
      const randomHoursAgo = Math.floor(Math.random() * 24) + 13; // Entre 13 y 36 horas atrás
      
      additionalPosts.push({
        id: this.mockPosts.length + i + 1,
        userId: this.mockPosts.length + i + 1,
        albumId: 1,
        upload_Date: new Date(Date.now() - (randomHoursAgo * 3600000)),
        url_File: this.iaModelImages[randomImageIndex], // Solo usa imágenes de iaModels
        description: this.generateRandomDescription(),
        contentType: 'image/jpeg',
        currentUserData: null,
        userProfile: {
          id: this.mockPosts.length + i + 1,
          userName: userNames[randomUserNameIndex],
          firstName: this.getFirstName(userNames[randomUserNameIndex]),
          lastName: this.getLastName(userNames[randomUserNameIndex]),
          followersCount: Math.floor(Math.random() * 3000) + 500,
          followsCount: Math.floor(Math.random() * 300) + 50,
          postssCount: Math.floor(Math.random() * 100) + 10
        },
        profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png'
      });
    }
    
    return additionalPosts;
  }

  // Método para generar descripciones aleatorias
  private generateRandomDescription(): string {
    const descriptions = [
      'Nueva sesión fotográfica con estilo único. ✨ #fotografia #estilo #arte',
      'Cada foto cuenta una historia diferente. 📖 #historia #fotografia #arte',
      'La belleza está en los detalles. 🌟 #belleza #detalles #fotografia',
      'Momentos capturados para siempre. 📸 #momentos #memorias #fotografia',
      'Estilo y elegancia en cada pose. 💎 #estilo #elegancia #moda',
      'La creatividad no tiene límites. 🎨 #creatividad #arte #inspiracion',
      'Fotografía que inspira y emociona. ❤️ #inspiracion #emocion #arte',
      'Cada imagen es una obra de arte. 🖼️ #arte #fotografia #creatividad'
    ];
    
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  // Métodos auxiliares para nombres
  private getFirstName(userName: string): string {
    const firstNameMap: { [key: string]: string } = {
      'alexandra_reyes': 'Alexandra',
      'mariana_ortiz': 'Mariana',
      'catalina_silva': 'Catalina',
      'gabriela_mendez': 'Gabriela',
      'valeria_castro': 'Valeria',
      'adriana_rios': 'Adriana',
      'natalia_vega': 'Natalia',
      'paula_jimenez': 'Paula'
    };
    return firstNameMap[userName] || 'Usuario';
  }

  private getLastName(userName: string): string {
    const lastNameMap: { [key: string]: string } = {
      'alexandra_reyes': 'Reyes',
      'mariana_ortiz': 'Ortiz',
      'catalina_silva': 'Silva',
      'gabriela_mendez': 'Méndez',
      'valeria_castro': 'Castro',
      'adriana_rios': 'Ríos',
      'natalia_vega': 'Vega',
      'paula_jimenez': 'Jiménez'
    };
    return lastNameMap[userName] || 'Usuario';
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
      const additionalPosts = this.generateAdditionalPosts();
      
      if (additionalPosts.length > 0) {
        this.posts = [...this.posts, ...additionalPosts];
        this.currentPage++;
        this.hasMorePosts = this.posts.length < 100; // Limitar a 100 posts
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
      this.loadMorePosts();
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
