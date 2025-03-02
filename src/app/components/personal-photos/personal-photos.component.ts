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
  pageSize: number = 2;
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
    this.isOwner = this.authService.isProfileOwner(this.profileId);
    this.loggedUserId = this.authService.getCurrentUserLoggedIdFromStorage();
    this.loadPersonalPhotos(this.page);
  }

  loadPersonalPhotos(page: number): void {
    if (this.isLoading) return; // Evita llamadas duplicadas
  
    this.isLoading = true;
  
    this.personalPhotosService.getPersonalPhotosByUserId(Number(this.profileId), page, this.pageSize)
      .subscribe({
        next: (response: PaginatedResultResponse<PersonalPhoto>) => {
          // Asegúrate de que this.personalPhotos no sea undefined
          if (!this.personalPhotos) {
            this.personalPhotos = []; // Inicializa como un array vacío si es undefined
          }
          
          // Usamos spread operator para agregar nuevas fotos
          this.personalPhotos = [...this.personalPhotos, ...response.items];
          
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


  createPersonalPhoto(file: File): void {
    this.isLoading = true;
    this.personalPhotosService.createPersonalPhoto(file, this.loggedUserId.toString()).subscribe({
      next: (response) => {
        this.closeModal();
        this.loadPersonalPhotos(this.page);
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
      this.page <= this.totalPages ) {
        this.loadPersonalPhotos(this.page + 1);
      }  
      this.lastScrollTop = scrollTop; // Guardamos la posición actual del scroll
    }
}

