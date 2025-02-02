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
  isEditingTitle = false;
  calculatedInputWidth = 0;
  loggedUserId = 0;

  albumId = '';
  totalItems: number = 0;
  posts: any;
  album: Album | null = null; // Puede ser null al inicio
  page: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  isEditing: boolean = false;
  isLoading = false;


  isModalOpen: boolean = false; // Controla la apertura del modal

  defaultPhoto = 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg';
  currentPhoto = this.defaultPhoto; // URL de la foto actual

  menuStates: { [key: string]: boolean } = {}; // Controla los estados de los menús
  albumData: albumPageData | null = null; // Variable para almacenar el álbum

  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;
  @ViewChild('title') titleElement!: ElementRef<HTMLHeadingElement>;

  constructor(private postService: PostService, private albumService: AlbumService, private route: ActivatedRoute, private authService: AuthService, private router: Router) { }
  hoverAddPhoto = false;


  ngOnInit(): void {
    this.isLoading = true;
    this.albumId = this.route.snapshot.paramMap.get('albumId') || '';
    this.isEditing = this.albumId != "" ? true : false;
    this.authService.getCurrentUserIdLogged().subscribe(
      id => {
        this.loggedUserId = id; // Asigna el ID a la variable
        console.log('ID del usuario actual:', this.loggedUserId);
      },
      error => {
        console.error('Error al obtener el ID del usuario:', error);
      }
    );

    if (this.isEditing) {
      this.loadAlbumData(Number(this.albumId));
      setTimeout(() => {
        this.loadPosts();
      }, 1000); // Timeout de 1 segundo
    } else {
      this.isLoading = false;
    }
  }

  loadAlbumData(albumId: number): void {
    this.albumService.getAlbumDataById(albumId).subscribe({
      next: (albumData) => {
        this.albumData = albumData; // Guarda la respuesta en la variable
        this.title = albumData.title;
        console.log('Álbum recibido:', this.albumData);
      },
      error: (err) => {
        console.error('Error al obtener el álbum:', err);
      }
    });
  }

  loadPosts(): void {
    this.postService.getPostsByAlbumId(Number(this.albumId), this.page, this.pageSize).subscribe({
      next: (response: PaginatedResultResponse<Post>) => {
        this.posts = response.items;
        this.totalItems = response.totalItems;
        this.page = response.page;
        this.pageSize = response.pageSize;

        // Calcular el total de páginas
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.isLoading = false;
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
    this.albumService.updateAlbumInfo(Number(this.albumId), this.title, null)
      .subscribe({
        next: () => console.log('Álbum actualizado correctamente'),
        error: (err) => console.error('Error al actualizar álbum', err)
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
    if (!this.isEditing) {
      this.createAlbum(file);
    }
    else {
      this.createPost(file);
    }
  }

  createAlbum(file: File): void {
    const newAlbum: AlbumRequest = {
      name: 'Mi Álbum',
      price: 50,
      userId: this.loggedUserId
    };

    this.albumService.createAlbum(newAlbum).subscribe({
      next: (albumId) => {
        if (albumId) {

          this.albumId = albumId.toString();
          this.createPost(file);
          this.router.navigate([`/albumContent/${this.albumId}`]);

        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al crear el álbum:', err);
      },
    });
  }


  createPost(file: File): void {
    this.postService.createPost(file, this.albumId, this.loggedUserId.toString()).subscribe({
      next: (response) => {
        console.log('Foto subida correctamente:', response);

        this.currentPhoto = URL.createObjectURL(file); // Actualiza la foto en la vista previa
        this.closeModal();
        if (this.isEditing) {
          this.loadPosts();
        }
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

  toggleMenu(postId: string): void {
    this.menuStates[postId] = !this.menuStates[postId];
  }

  isMenuOpen(postId: string): boolean {
    return !!this.menuStates[postId];
  }

  editPost(post: any): void {
    console.log('Editar', post);
    // Implementa tu lógica aquí
  }

  deletePost(post: any): void {
    console.log('Eliminar', post);
    // Implementa tu lógica aquí
  }
}