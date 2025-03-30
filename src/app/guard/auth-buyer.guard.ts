import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { AlbumService } from '../services/album.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthBuyerGuard implements CanActivate {
    constructor(private router: Router, private albumService: AlbumService, private authService: AuthService) {}
  
   canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
      // Obtener el parámetro `albumId` de la URL
      var user = this.authService.getUserStorage();
      if (!user)
        return  of(false);
  
      const albumId = route.paramMap.get('albumId');
      if (!albumId) {
        return  of(true);
      }
  
      // Verificar en el backend si el usuario tiene acceso al álbum
      return this.albumService.isAlbumOwnerOrBuyer(Number(albumId)).pipe(
        map((esValido: boolean) => {
          if (!esValido) {
            // Si no tiene acceso, redirige a una página de error
        //    this.router.navigate([`/album-detail/${albumId}`]);
            return true;
          }
         // this.router.navigate([`/albumContent/${albumId}`]);
         this.router.navigate([`/albumContent/${albumId}`]);
          return false; // Permite el acceso
        }),
        catchError(() => {
          // En caso de error, redirige al usuario
       //   this.router.navigate([`/album-detail/${albumId}`]);
          return of(false);
        })
      );
    }
  }