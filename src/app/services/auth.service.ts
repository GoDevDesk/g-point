import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { UserRegister } from '../models/userRegister';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //private apiUrl = 'https://localhost:44335/api'; // URL base del backend
  private apiUrl = `${environment.apiPtUsersBaseUrl}/api`;  // Concatenar el subpath


  // private currentUser: any; // Almacena el usuario actual
  private visitedProfileId = 0; // Almacena el id del perfil visitado
  public CurrentUserLoggedId = 0;
  private currentUserIdBehavior = new BehaviorSubject<number>(0); // Inicialmente no hay usuario logueado

  constructor(private http: HttpClient) { }

  // Método para enviar el login y recibir el token
  login(credentials: { username: string; password: string }): Observable<any> {
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
  }

  cleanStorage() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('avatarUrl');
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
