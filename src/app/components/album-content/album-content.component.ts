import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { PaginatedResultResponse } from 'src/app/models/paginatedResultResponse';
import { Post } from 'src/app/models/Post';
import { authUser, User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-album-content',
  templateUrl: './album-content.component.html',
  styleUrls: ['./album-content.component.scss']
})
export class AlbumContentComponent implements OnInit {
  title = 'Título por defecto';
  isEditingTitle = false;
  calculatedInputWidth = 0;
  loggedUserId = 0;

  albumId = '';
  totalItems: number = 0;
  posts: any;
  page: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;

  isModalOpen: boolean = false; // Controla la apertura del modal

  defaultPhoto = 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg';
  currentPhoto = this.defaultPhoto; // URL de la foto actual

  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;
  @ViewChild('title') titleElement!: ElementRef<HTMLHeadingElement>;

  constructor(private postService: PostService, private route: ActivatedRoute, private authService: AuthService) { }
  hoverAddPhoto = false;


  ngOnInit(): void {
    this.albumId = this.route.snapshot.paramMap.get('albumId') || '';
    this.loadPosts();

    this.authService.getCurrentUserIdLogged().subscribe(
      id => {
        this.loggedUserId = id; // Asigna el ID a la variable
        console.log('ID del usuario actual:', this.loggedUserId);
      },
      error => {
        console.error('Error al obtener el ID del usuario:', error);
      }
    );
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
      },
      error: (err) => {
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
    const titleEl = document.querySelector('h2');
    if (titleEl) {
      this.calculatedInputWidth = titleEl.offsetWidth;
    }
  }

  /**
   * Guarda el título y sale del modo de edición.
   */
  saveTitle() {
    this.isEditingTitle = false;
  }

  /////modal

  // Método para abrir el modal
  openModal(): void {
    debugger;
    this.isModalOpen = true;
  }

  // Método para cerrar el modal
  closeModal(): void {
    this.isModalOpen = false;
  }

  handlePhotoSelected(file: File): void {
    if (this.loggedUserId != 0) {
      this.postService.createPost(file, this.albumId, this.loggedUserId.toString()).subscribe({
        next: (response) => {
          console.log('Foto subida correctamente:', response);

          this.currentPhoto = URL.createObjectURL(file); // Actualiza la foto en la vista previa
          this.closeModal();
          this.loadPosts();
        },
        error: (error) => {
          console.error('Error al enviar foto al servidor:', error);
        },
      });

    }
  }
}