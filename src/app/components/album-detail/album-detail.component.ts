import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service'; // Asegúrate de tener el servicio de autenticación
import { AlbumService } from 'src/app/services/album.service'; // Asegúrate de tener el servicio para obtener álbumes
import { Album } from 'src/app/models/album';
import { albumPageData } from 'src/app/models/albumPageData';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss'],
})
export class AlbumDetailComponent implements OnInit {
  album: Album | null = null;
  isOwner: boolean = false;
  albumData: albumPageData | null = null; // Variable para almacenar el álbum
  albumId = '';
  isLoading = false;
  isLoggedUser = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService, // Servicio para verificar el dueño
    private albumService: AlbumService // Servicio para obtener los datos del álbum
  ) {}

  ngOnInit(): void {
    this.isLoggedUser = this.authService.getCurrentUserLoggedIdFromStorage() != 0 ? true : false;
    this.isLoading = true;
    this.albumId = this.route.snapshot.paramMap.get('albumId') || '';
    this.loadAlbumData(Number(this.albumId));

  }

  buyContent() {
    // Lógica para la compra del contenido
    console.log('Contenido comprado!');
  }

  loadAlbumData(albumId: number): void {
    this.albumService.getAlbumDataById(albumId).subscribe({
      next: (albumData) => {
        this.albumData = albumData; // Guarda la respuesta en la variable  
      },
      error: (err) => {
        console.error('Error al obtener el álbum:', err);
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

 }
