import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { PaginatedResultResponse } from 'src/app/models/paginatedResultResponse';
import { PersonalPhoto } from 'src/app/models/PersonalPhoto';
import { Post } from 'src/app/models/Post';
import { AuthService } from 'src/app/services/auth.service';
import { PersonalPhotosService } from 'src/app/services/personal-photos.service';

@Component({
  selector: 'app-personal-photos',
  templateUrl: './personal-photos.component.html',
  styleUrls: ['./personal-photos.component.scss']
})
export class PersonalPhotosComponent implements OnInit {

  loggedUserId = 0;
  personalPhotos: PersonalPhoto[] | undefined;
  profileId: string = ''; // ID del perfil visitado

  totalItems: number = 0;
  page: number = 1;
  pageSize: number = 4;
  totalPages: number = 0;
  isLoading = false;
  isOwner = false;
  lastScrollTop: number = 0; // Guarda la última posición del scroll


  isModalOpen: boolean = false; // Controla la apertura del modal

  constructor(private personalPhotosService: PersonalPhotosService, private authService: AuthService, private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    // this.isLoading = true;
    this.profileId = this.route.snapshot.paramMap.get('id') || '';

    this.route.paramMap.subscribe(params => {
      this.profileId = params.get('id') || ''; // Capturar el nuevo ID de la URL
      this.personalPhotos = [];
      this.isOwner = this.authService.isProfileOwner(this.profileId);
      this.loggedUserId = this.authService.getCurrentUserLoggedIdFromStorage();
      debugger;
      this.loadPersonalPhotos(this.page);
    });

  }

  loadPersonalPhotos(page: number): void {
    this.isLoading = true;

    this.personalPhotosService.getPersonalPhotosByUserId(Number(this.profileId), page, this.pageSize)
      .subscribe({
        next: (response: PaginatedResultResponse<PersonalPhoto>) => {
          if (!this.personalPhotos) {
            this.personalPhotos = [];
          }

          // Agregar nuevas fotos y ordenar por fecha (de más nueva a más antigua)
          this.personalPhotos = [...this.personalPhotos, ...response.items]
            .sort((a, b) => new Date(b.upload_Date).getTime() - new Date(a.upload_Date).getTime());

          this.totalItems = response.totalItems;
          this.page = response.page;
          this.pageSize = response.pageSize;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error loading posts', err);
        }
      });
  }


  createPersonalPhoto(file: File): void {
    this.isLoading = true;
    this.personalPhotosService.createPersonalPhoto(file, this.loggedUserId.toString()).subscribe({
      next: () => {
        this.closeModal();
        this.isLoading = false;

        // Volver a cargar todas las fotos desde el servidor
        this.loadPersonalPhotos(1); // Cargar desde la primera página para que la nueva foto esté arriba
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al enviar foto al servidor:', error);
      },
    });
  }


  goToAlbumCreation(): void {
    // this.router.navigate(['/albumContent']);
  }
  openModal(): void {
    this.isModalOpen = true;
  }
  // Método para cerrar el modal
  closeModal(): void {
    this.isModalOpen = false;
  }

  handlePhotoSelected(file: File): void {
    this.isLoading = true;
    this.createPersonalPhoto(file);
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Solo cargar más contenido si el usuario está bajando y ha llegado al final
    if (scrollTop > this.lastScrollTop && (windowHeight + scrollTop) >= documentHeight - 10 && !this.isLoading &&
      this.page <= this.totalPages) {
      this.loadPersonalPhotos(this.page + 1);
    }
    this.lastScrollTop = scrollTop; // Guardamos la posición actual del scroll
  }

  openMenuId: number | null = null; // Controla qué menú está abierto

  toggleMenu(photoId: number): void {
    this.openMenuId = this.openMenuId === photoId ? null : photoId; // Abre/cierra el menú
  }

  deletePersonalPhoto(photoId: number): void {
    if (confirm('¿Seguro que quieres eliminar esta foto?')) {
      this.personalPhotosService.deletePersonalPhoto(this.loggedUserId, photoId).subscribe({
        next: () => {
          // Eliminar la foto del array
          this.personalPhotos = this.personalPhotos?.filter(photo => photo.id !== photoId);
        },
        error: (error) => {
          console.error('Error al eliminar la foto:', error);
        }
      });
    }
  }
}

