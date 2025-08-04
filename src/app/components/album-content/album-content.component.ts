import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Album } from 'src/app/models/album';
import { albumPageData } from 'src/app/models/albumPageData';
import { AlbumRequest } from 'src/app/models/albumRequest';
import { PaginatedResultResponse } from 'src/app/models/paginatedResultResponse';
import { Post } from 'src/app/models/Post';
import { authUser, User } from 'src/app/models/user';
import { AlbumService } from 'src/app/services/album.service';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-album-content',
  templateUrl: './album-content.component.html',
  styleUrls: ['./album-content.component.scss']
})
export class AlbumContentComponent implements OnInit {
  title = 'Inserte un título';
  price = 'Inserte un título';
  isEditingTitle = false;
  isEditingPrice = false;
  calculatedInputWidth = 0;
  loggedUserId = 0;

  albumId = '';
  totalItems: number = 0;
  posts: any;
  album: Album | null = null; // Puede ser null al inicio
  page: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  isLoading = false;
  isOwner = false;


  isModalOpen: boolean = false; // Controla la apertura del modal

  defaultPhoto = 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg';
  currentPhoto = this.defaultPhoto; // URL de la foto actual

  menuStates: { [key: string]: boolean } = {}; // Controla los estados de los menús
  albumData: albumPageData | null = null; // Variable para almacenar el álbum

  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;
  @ViewChild('title') titleElement!: ElementRef<HTMLHeadingElement>;
  @ViewChild('priceInput') priceInput!: ElementRef<HTMLInputElement>;

  constructor(private postService: PostService, private albumService: AlbumService, private route: ActivatedRoute, private authService: AuthService, private router: Router) { }
  hoverAddPhoto = false;

  ngOnInit(): void {
    this.isLoading = true;
    this.albumId = this.route.snapshot.paramMap.get('albumId') || '';
    this.loggedUserId = this.authService.getCurrentUserLoggedIdFromStorage()
    
    // Cargar datos del álbum primero
    this.loadAlbumData(Number(this.albumId));
    
    // Cargar posts después de un pequeño delay
    setTimeout(() => {
      this.loadPosts();
    }, 500); // Reducido a 500ms para mejor UX

  }

  loadAlbumData(albumId: number): void {
    this.isLoading = true;
    this.albumService.getAlbumDataById(albumId).subscribe({
      next: (albumData) => {
        this.albumData = albumData; // Guarda la respuesta en la variable
        // Solo actualiza si los valores son válidos
        if (this.albumData.userId == this.loggedUserId)
          this.isOwner = true;
        if (albumData.title) {
          this.title = albumData.title;
        }
        if (albumData.price !== null && albumData.price !== undefined) {
          this.price = albumData.price.toString();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener el álbum:', err);
        this.isLoading = false;
      }
    });
  }

  loadPosts(): void {
    this.isLoading = true;
    this.postService.getPostsByAlbumId(Number(this.albumId), this.page, this.pageSize).subscribe({
      next: (response: PaginatedResultResponse<Post>) => {
        this.posts = response.items;
        this.totalItems = response.totalItems;
        this.page = response.page;
        this.pageSize = response.pageSize;

        // Calcular el total de páginas
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        
        // Simular un pequeño delay para que se vea el spinner
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading posts', err);
      }
    });
  }

  ngAfterViewInit() {
    this.setInputWidth();
  }

  /**
   * Activa el modo de edición y enfoca el input dinámicamente.
   */
  startEditing() {
    this.isEditingTitle = true;

    setTimeout(() => {
      this.setInputWidth();
      this.titleInput?.nativeElement.focus();
    });
  }

  startEditingPrice() {
    this.isEditingPrice = true;

    setTimeout(() => {
      this.setInputWidth();
      this.priceInput?.nativeElement.focus();
    });
  }
  /**
   * Calcula el tamaño dinámico del campo de texto para coincidir con el tamaño real del título visible.
   */
  setInputWidth() {
    const titleEl = document.getElementById('title-container');
    if (titleEl) {
      this.calculatedInputWidth = titleEl.offsetWidth;
    }
  }

  /**
   * Guarda el título y sale del modo de edición.
   */
  saveTitle() {
    this.isEditingTitle = false;
    this.albumService.updateAlbumInfo(Number(this.albumId), this.title, Number(this.price))
      .subscribe({
        next: () => {
          this.loadAlbumData(Number(this.albumId)); // 🔹 Solo recargar si es necesario
        },
        error: (err) => console.error('Error al actualizar álbum', err)
      });
  }


  savePrice() {
    this.isEditingPrice = false;
    this.albumService.updateAlbumInfo(Number(this.albumId), null, Number(this.price))
      .subscribe({
        next: () => {
          this.loadAlbumData(Number(this.albumId)); // 🔹 Solo recargar si es necesario
        },
        error: (err) => console.error('Error al actualizar precio', err)
      });
  }

  /////modal

  // Método para abrir el modal
  openModal(): void {
    this.isModalOpen = true;
  }

  // Método para cerrar el modal
  closeModal(): void {
    this.isModalOpen = false;
  }

  handlePhotoSelected(file: File): void {
    this.isLoading = true;
    this.createPost(file);
  }

  createPost(file: File): void {
    this.isLoading = true;
    this.postService.createPost(file, this.albumId, this.loggedUserId.toString()).subscribe({
      next: (response) => {
        this.currentPhoto = URL.createObjectURL(file); // Actualiza la foto en la vista previa        
        this.closeModal();
        // Recargar posts después de crear uno nuevo
        this.loadPosts();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al enviar foto al servidor:', error);
      },
    });
  }

  toggleLike(post: any): void {
    post.isLiked = !post.isLiked;
  }

  getPostDescription(post: any): string {
    // Si ya tiene una descripción válida, la usamos
    if (post.description && post.description.trim() !== '' && post.description !== 'asd') {
      return post.description;
    }
    
    // Array de descripciones ingeniosas para modelos
    const photoDescriptions = [
      '✨ Brillo natural en cada momento ✨',
      '💫 Capturando la magia del día 💫',
      '🌅 Amanecer perfecto para ti 🌅',
      '💋 Un beso de luz y elegancia 💋',
      '🔥 Pasión y fuego en cada frame 🔥',
      '💎 Como diamantes, únicos y brillantes 💎',
      '🌙 Noches de seducción y misterio 🌙',
      '🌸 Delicada como una flor en primavera 🌸',
      '💃 Bailando con la vida y la libertad 💃',
      '🌟 Estrellas en mis ojos para ti 🌟',
      '💕 Amor y pasión en cada pixel 💕',
      '🌊 Olas de sensualidad y gracia 🌊',
      '🔥 Incendio de belleza y fuego 🔥',
      '💫 Magia pura en cada sonrisa 💫',
      '🌹 Rosas rojas para corazones valientes 🌹',
      '✨ Elegante como la noche estrellada ✨',
      '💋 Dulce tentación en cada ángulo 💋',
      '🌅 Momentos dorados de pura felicidad 🌅',
      '💎 Preciosa como joyas en la noche 💎',
      '🔥 Fuego interior que nunca se apaga 🔥'
    ];
    
    // Array de descripciones para videos
    const videoDescriptions = [
      '🎬 Video exclusivo para ti amor 🎬',
      '💫 Contenido premium que te encantará 💫',
      '🔥 Video caliente y sensual 🔥',
      '💋 Momentos íntimos solo para ti 💋',
      '✨ Video especial con magia extra ✨',
      '💎 Contenido exclusivo de alta calidad 💎',
      '🌙 Video nocturno lleno de misterio 🌙',
      '💕 Amor y pasión en movimiento 💕',
      '🌟 Estrellas bailando en video 🌟',
      '🔥 Fuego y pasión en cada frame 🔥'
    ];
    
    // Generar descripción basada en el tipo de contenido
    if (post.contentType === 'video/mp4') {
      const randomIndex = Math.floor(Math.random() * videoDescriptions.length);
      return videoDescriptions[randomIndex];
    } else {
      const randomIndex = Math.floor(Math.random() * photoDescriptions.length);
      return photoDescriptions[randomIndex];
    }
  }

  toggleMenu(postId: string): void {
    this.menuStates[postId] = !this.menuStates[postId];
  }

  isMenuOpen(postId: string): boolean {
    return !!this.menuStates[postId];
  }

  editPost(post: any): void {
    // Implementa tu lógica aquí
  }

  deleteAlbum() {
    if (confirm('¿Estás seguro de que deseas eliminar este álbum? Esta acción no se puede deshacer.')) {
      this.isLoading = true;

      this.albumService.deleteAlbum(Number(this.albumId)).subscribe({
        next: () => {
          this.isLoading = false;
          alert('Álbum eliminado correctamente.');
          this.router.navigate([`/profile/${this.loggedUserId}`]);
        },
        error: (error) => {
          this.isLoading = false;

          // Muestra en consola para depurar
          console.error('Error al eliminar el álbum:', error);

          // Verifica si hay un mensaje en error.error o muestra un mensaje genérico
          const errorMessage = 'No se pudo eliminar el álbum.';
          alert(errorMessage);
        }
      });
    }
  }

  deletePost(post: any): void {
    if (confirm('¿Estás seguro de que deseas eliminar este Post? Esta acción no se puede deshacer.')) {
      this.isLoading = true;
      this.postService.deletePost(this.loggedUserId, post.id).subscribe({
        next: () => {
          this.isLoading = false;
          alert('Post eliminado correctamente.');
          this.loadPosts();
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error al eliminar el Post:', error);
          alert(error.error || 'No se pudo eliminar el Post.');
        }
      });
    }
  }
}