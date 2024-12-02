import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service'; // Asegúrate de tener el servicio de autenticación
import { AlbumService } from 'src/app/services/album.service'; // Asegúrate de tener el servicio para obtener álbumes
import { Album } from 'src/app/models/album';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss'],
})
export class AlbumDetailComponent implements OnInit {
  album: Album | null = null;
  albumId: number | null = null;
  isOwner: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService, // Servicio para verificar el dueño
    private albumService: AlbumService // Servicio para obtener los datos del álbum
  ) {}

  ngOnInit(): void {
    // Obtener el albumId desde la URL
    this.albumId = +this.route.snapshot.paramMap.get('albumId')!;
    
    // Obtener si el usuario es el dueño del álbum
    this.isAlbumOwner = this.authService.isAlbumOwner(this.albumId.toString());

    // Si el usuario es el dueño, redirigir a la ruta que definiste
    if (this.isAlbumOwner) {
      this.router.navigate(['/album-content', this.albumId]); // O la ruta que quieras
      return; // Detener ejecución
    }

    // Si el usuario no es el dueño, buscar los datos del álbum
    this.fetchAlbumData();
  }

  // Método para obtener los datos del álbum desde el backend
  fetchAlbumData(): void {
    this.albumService.getAlbumById(this.albumId).subscribe(
      (album: Album) => {
        this.album = album;
      },
      (error) => {
        console.error('Error al obtener el álbum:', error);
        // Maneja el error (redirige, muestra un mensaje, etc.)
      }
    );
  }
}
