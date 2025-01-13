import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { authUser } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { FormControl } from '@angular/forms';
import { catchError, concatMap, debounceTime, distinctUntilChanged, filter, of, startWith, switchMap } from 'rxjs';
import { SearchService } from 'src/app/services/search.service';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  searchControl = new FormControl('');
  results: any[] = [];
  currentUserLoggedId = ""
  currentAvatarPhoto = ""
  constructor(private renderer: Renderer2, private el: ElementRef, private router: Router, private authService: AuthService,
              private profileService: ProfileService, private searchService: SearchService) { }

  ngOnInit(): void {
    this.currentUserLoggedId = this.authService.getCurrentUserLoggedId().toString();

    this.profileService.getAvatarPhoto().subscribe(photoUrl => {
      this.currentAvatarPhoto = photoUrl;
      console.log('Foto cargada:', this.currentAvatarPhoto);
    });

    this.searchControl.valueChanges
    .pipe(
      debounceTime(300), // Espera 300ms tras cada cambio
      distinctUntilChanged(), // Ignora valores consecutivos iguales
      // Realizamos la búsqueda con switchMap
      switchMap((query) => {
        const trimmedQuery = query?.trim(); // Elimina espacios
        if (!trimmedQuery) {
          // Si el texto está vacío, vacía los resultados
          this.results = [];
          return of([]); // Devolvemos un observable vacío
        }

        // Si el texto no está vacío, realizamos la búsqueda
        return this.searchService.search(trimmedQuery).pipe(
          catchError((error) => {
            // Manejo de error: si algo sale mal, simplemente vaciamos los resultados
            console.error('Error en la búsqueda:', error);
            this.results = [];
            return of([]); // Retornamos un observable vacío para continuar el flujo
          })
        );
      })
    )
    .subscribe(
      (data) => {
        this.results = data; // Actualiza los resultados
      }
    );
  }

  ngAfterViewInit() {
    const subscriptElement = this.el.nativeElement.querySelector('.mat-mdc-form-field-subscript-wrapper');
    if (subscriptElement) {
      this.renderer.removeChild(this.el.nativeElement, subscriptElement);
    }
  }
  navigateToProfile(): void {
    this.router.navigateByUrl(`/profile/${this.currentUserLoggedId}`);
  }

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }

  logout(): void {
    this.authService.logout();
    // Lógica de cierre de sesión
    console.log('Cerrando sesión...');
  }

  navigateToOtherProfile(user: any): void {
    this.router.navigate(['/profile', user.id]); // Navega al perfil del usuario
  }
}