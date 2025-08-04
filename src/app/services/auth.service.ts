import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap, timer, switchMap, catchError, of } from 'rxjs';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { UserRegister } from '../models/userRegister';
import { ProfileService } from './profile.service';
import { getAuth, signInWithCustomToken, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import 'firebase/compat/auth'; // 👈 NECESARIO
import * as firebase from 'firebase/compat';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiPtUsersBaseUrl}/api`;
  private visitedProfileId = 0; // Almacena el id del perfil visitado
  public CurrentUserLoggedId = 0;
  private currentUserIdBehavior = new BehaviorSubject<number>(0); // Inicialmente no hay usuario logueado
  private validationInterval: any;
  private isValidationRunning = false;

  constructor(
    private http: HttpClient, 
    private profileService: ProfileService
  ) { 
    initializeApp(environment.firebaseConfig); 
  }

  // Método para enviar el login y recibir el token
  login(credentials: { username: string; email: string; password: string }): Observable<any> {
    this.logout(); //me deslogueo para estar seguro q no hay nada de un user viejo
    return this.http.post(`${this.apiUrl}/login`, credentials, { responseType: 'text' });
  }

  register(data: UserRegister) {
    return this.http.post(`${this.apiUrl}/user`, data);
  }

  getCurrentUserLoggedIdFromStorage(): number {
    const user = this.getUserStorage();
    if (user) {
      try {
        const parsedUser = JSON.parse(user); // Convierte el JSON string a un objeto
        return parsedUser.id || 0; // Devuelve el ID o 0 si no existe
      } catch (error) {
        console.error('Error al parsear el usuario almacenado:', error);
        return 0; // Devuelve 0 en caso de error
      }
    }
    return 0; // Devuelve 0 si no hay usuario almacenado
  }

  setCurrentUserIdBehavior(userId: number): void {
    this.currentUserIdBehavior.next(userId); // Actualiza el BehaviorSubject
  }
  
  getCurrentUserIdLoggedBehavior(): Observable<number> {
    return this.currentUserIdBehavior.asObservable(); // Devuelve el estado como observable
  }

  // Guardar el token en localStorage
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
    // Iniciar validación de token cuando se establece un token
    this.startTokenValidation();
  }

  // Obtener el token desde localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUserStorage(): any | null {
    return localStorage.getItem('currentUser');
  }

  // Eliminar el token al cerrar sesión
  logout(): void {
    this.CurrentUserLoggedId = 0;
    this.cleanStorage();
    this.setCurrentUserIdBehavior(0);
    // Detener validación de token al cerrar sesión
    this.stopTokenValidation();
  }

  async loginFirebaseAuth(firebaseToken: string): Promise<void> {
    const auth = getAuth();
    await signInWithCustomToken(auth, firebaseToken);
  }

  cleanStorage() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('avatarUrl');
    try {
      const auth = getAuth();
      signOut(auth); // Esperar a que Firebase cierre sesión
      console.log('Sesión de Firebase cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar sesión de Firebase:', error);
    }
    this.profileService.removeAvatarPhoto();
  }

  // Inicia la validación del token cada 10 segundos
  private startTokenValidation(): void {
    if (this.isValidationRunning) return;
    
    this.isValidationRunning = true;
    // Verificar cada 10 segundos (10000 ms)
    this.validationInterval = timer(0, 10000).pipe(
      switchMap(() => this.checkToken())
    ).subscribe({
      next: (isValid) => {
        if (!isValid) {
          console.log('Token inválido detectado, cerrando sesión...');
          this.logout();
        }
      },
      error: (error) => {
        console.error('Error en validación de token:', error);
        this.logout();
      }
    });
  }

  // Detiene la validación
  private stopTokenValidation(): void {
    if (this.validationInterval) {
      this.validationInterval.unsubscribe();
      this.validationInterval = null;
    }
    this.isValidationRunning = false;
  }

  // Verifica si el token es válido
  private checkToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      // Si no hay token, no hacer logout, solo retornar false
      return of(false);
    }

    return this.http.get(`${this.apiUrl}/user/currentUser`).pipe(
      switchMap(() => of(true)),
      catchError((error) => {
        // Verificar si es un error 401 (Unauthorized)
        if (error.status === 401) {
          console.log('Token inválido detectado (401 Unauthorized)');
          return of(false);
        }
        // Para otros errores, también consideramos el token como inválido
        console.log('Error en validación de token:', error.status);
        return of(false);
      })
    );
  }

  getCurrentUserLogged(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/currentUser`).pipe(
      tap(user => {
        // Aquí se configura el ID del usuario una vez que se recibe la respuesta
        this.setCurrentUserIdBehavior(user.id);
      })
    );
  }

  getCurrentUserIdLogged(): Observable<number> {
    return this.getCurrentUserLogged().pipe(
      map(user => user.id) // Extrae el ID del usuario
    );
  }

  isProfileOwner(profileId: string): boolean {

    // Obtener el currentUser del localStorage
    const storedUser = localStorage.getItem('currentUser');

    // Si no existe el usuario en el localStorage, devolver false
    if (!storedUser) {
      return false;
    }

    // Parsear el objeto JSON almacenado en localStorage
    const currentUser = JSON.parse(storedUser);

    // Comparar el ID del perfil con el ID del currentUser
    return String(currentUser.id) === profileId;
  }

  getVisitedProfileId(): number {
    return this.visitedProfileId;
  }

  setVisitedProfileId(id: number): void {
    this.visitedProfileId = id;
  }
}
