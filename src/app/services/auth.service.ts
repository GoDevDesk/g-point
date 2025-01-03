import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //private apiUrl = 'https://localhost:44335/api'; // URL base del backend
    private apiUrl = `${environment.apiPtUsersBaseUrl}/api`;  // Concatenar el subpath

  
  // private currentUser: any; // Almacena el usuario actual
  private visitedProfileId = 0; // Almacena el id del perfil visitado
  public CurrentUserLoggedId = 0;
  constructor(private http: HttpClient) { }

  // Método para enviar el login y recibir el token
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, { responseType: 'text' });
  }

  // setCurrentUserLoggedId(id: number): void {
  //   localStorage.setItem('currentUserLoggedId', String(id));
  // }
  
  getCurrentUserLoggedId(): number {
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
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.CurrentUserLoggedId = 0;
  }


  getCurrentUserLogged(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/currentUser`);
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
