import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private albumService: AlbumService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loadAlbums();
  }

  loadAlbums(): void {
    var visitedProfileId = this.authService.getVisitedProfileId();
    this.albumService.getAlbumsByUserId(visitedProfileId, this.page, this.pageSize).subscribe({
      next: (response: PaginatedResultResponse<Album>) => {
        this.albums = response.items;
        this.totalItems = response.totalItems;
        this.page = response.page;
        this.pageSize = response.pageSize;

        // Calcular el total de páginas
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      },
      error: (err) => {
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

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadAlbums();
  }
}