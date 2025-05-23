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
  isModalOpen = false;

  constructor(private route: ActivatedRoute, private albumService: AlbumService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.route.paramMap.subscribe(params => {
      this.profileId = params.get('id') || '';
      this.isOwner = this.authService.isProfileOwner(this.profileId);

      this.albums = [];
      this.page = 1;
      
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
        this.page = response.page;
        this.pageSize = response.pageSize;

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
        state: { album },
      });
    }
  }

  openCreateAlbumModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  handleCreateAlbum(albumData: { name: string, price: number }): void {
    this.isLoading = true;
    const userId = this.authService.getCurrentUserLoggedIdFromStorage();
    const newAlbum = {
      name: albumData.name,
      price: albumData.price,
      userId: userId
    };

    this.albumService.createAlbum(newAlbum).subscribe({
      next: (albumId) => {
        if (albumId) {
          this.router.navigate([`/albumContent/${albumId}`]);
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error al crear el álbum:', err);
        this.isLoading = false;
      }
    });
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
    if(this.totalItems < 6) ///mejorar para q pagine cada 5 items nomas, ahora solo funciona al principio
      return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop > this.lastScrollTop && (windowHeight + scrollTop) >= documentHeight - 10 && !this.isLoading && 
    this.page <= this.totalPages ) {
      this.loadAlbums(this.page + 1);
    }
    this.lastScrollTop = scrollTop;
  }
}