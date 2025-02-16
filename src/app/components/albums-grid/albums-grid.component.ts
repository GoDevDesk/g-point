import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Album } from 'src/app/models/album';
import { PaginatedResultResponse } from 'src/app/models/paginatedResultResponse';
import { AlbumService } from 'src/app/services/album.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-albums-grid',
  templateUrl: './albums-grid.component.html',
  styleUrls: ['./albums-grid.component.scss']
})
export class AlbumsGridComponent implements OnInit {
  albums: Album[] = [];
  totalItems: number = 0;
  page: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  isLoading = false;
  profileId = '';
  isOwner = false;
  lastScrollTop: number = 0; // Guarda la última posición del scroll


  constructor(private route: ActivatedRoute, private albumService: AlbumService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.route.paramMap.subscribe(params => {
      this.profileId = params.get('id') || ''; // Capturar el nuevo ID de la URL
      this.isOwner = this.authService.isProfileOwner(this.profileId);

      this.albums = []; // unificar los metodos de limpieza 
      this.page = 1;// unificar los metodos de limpieza 
      
      console.log('Cambio detectado en la URL. Nuevo ID:', this.profileId);
      this.loadAlbums(this.page);
    });
  }

  loadAlbums(page:number): void {
    this.isLoading = true;
    var visitedProfileId = this.authService.getVisitedProfileId();
    this.albumService.getAlbumsByUserId(visitedProfileId, page, this.pageSize).subscribe({
      next: (response: PaginatedResultResponse<Album>) => {
        this.albums = [...this.albums, ...response.items];
        this.totalItems = response.totalItems;
        this.page = response.page; // el numero de pagina manejarlo desde el paginator
        this.pageSize = response.pageSize;

        // Calcular el total de páginas
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading albums', err);
      }
    });
  }

  navigateToAlbum(albumId: number): void {
    const album = this.albums.find((a) => a.id === albumId);
    var profileIdthis = this.authService.getVisitedProfileId();
    var isOwner = this.authService.isProfileOwner(profileIdthis.toString());
    if (isOwner) {
      this.router.navigate(['/albumContent', albumId]);
    } else {
      this.router.navigate(['/album-detail', albumId], {
        state: { album }, // Pasar el objeto como estado
      });
    }
  }

  goToAlbumCreation(): void {
    this.router.navigate(['/albumContent']);
  }

  // onPageChange(newPage: number): void {
  //   this.page = newPage;
  //   this.loadAlbums();
  // }

  @HostListener("window:scroll", [])
  onScroll(): void {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Solo cargar más contenido si el usuario está bajando y ha llegado al final
    if (scrollTop > this.lastScrollTop && (windowHeight + scrollTop) >= documentHeight - 10 && !this.isLoading && 
    this.page <= this.totalPages ) {
      this.loadAlbums(this.page + 1);
    }

    this.lastScrollTop = scrollTop; // Guardamos la posición actual del scroll
  }
}