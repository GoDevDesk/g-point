import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, map, observable, Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AlbumService } from '../services/album.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router, private albumService: AlbumService, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    // Obtener el parámetro `albumId` de la URL
    const albumId = route.paramMap.get('albumId');
    if (!albumId) {
      return  of(true);
    }

    // Verificar en el backend si el usuario tiene acceso al álbum
    return this.albumService.isAlbumOwnerOrBuyer(Number(albumId)).pipe(
      map((esValido: boolean) => {
        if (!esValido) {
          // Si no tiene acceso, redirige a una página de error
          this.router.navigate([`/album-detail/${albumId}`]);
          return false;
        }
       // this.router.navigate([`/albumContent/${albumId}`]);
        return true; // Permite el acceso
      }),
      catchError(() => {
        // En caso de error, redirige al usuario
        this.router.navigate([`/album-detail/${albumId}`]);
        return of(false);
      })
    );
  }
}