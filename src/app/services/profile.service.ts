import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProfilePicture } from '../models/profilePicture';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
 // private apiUrl = 'https://localhost:44306/api/profile-picture'; // Cambia la URL según la ruta de tu servidor.

  private apiUrl = `${environment.apiPtFilesBaseUrl}/api/profile-picture`;  // Concatenar el subpath
  private currentPhotoUrlSubject = new BehaviorSubject<string>('');
  currentPhotoUrl$ = this.currentPhotoUrlSubject.asObservable();


  constructor(private http: HttpClient) {
        // Recuperamos la URL del avatar desde localStorage (si existe)
        const storedAvatar = localStorage.getItem('avatarUrl');
    
        // Si hay una URL almacenada, la usamos. Si no, asignamos un valor vacío.
        this.currentPhotoUrlSubject = new BehaviorSubject<string>(storedAvatar || '');
  }

  // /**
  //  * Envía la foto al servidor mediante un POST.
  //  * @param file Archivo a enviar.
  //  * @param userId Identificador del usuario.
  //  * @returns Observable de la respuesta HTTP.
  //  */
  createPhoto(file: File, userId: string): Observable<any> {
    const formData = new FormData();
    formData.append('multimedia', file);
    formData.append('userId', userId);
    formData.append('description', 'asd');

    return this.http.post(`${this.apiUrl}`, formData);
  }

  updatePhoto(file: File, profilePictureId: number): Observable<any> {
    const formData = new FormData();
    formData.append('multimedia', file);
    formData.append('id', profilePictureId.toString());
    return this.http.put(`${this.apiUrl}`, formData)
  }

  getProfilePhoto(userId: number): Observable<ProfilePicture> {
    // Realiza la solicitud HTTP y ejecuta setAvatarPhoto cuando llegue la respuesta
    return this.http.get<ProfilePicture>(`${this.apiUrl}/user/${userId}`).pipe(
      tap((photoUrl: ProfilePicture) => {
        const newPhotoUrl = photoUrl.url_File;

        // Aquí se ejecuta setAvatarPhoto cuando se reciba la respuesta
      //  localStorage.setItem('avatarUrl', newPhotoUrl);

     //   this.setAvatarPhoto(newPhotoUrl);
      })
    );
  }

  setAvatarPhoto(profilePicture: string) {
    this.currentPhotoUrlSubject.next(profilePicture);  // Emitir el nuevo valor
    localStorage.setItem('avatarUrl', profilePicture); // Guardamos la nueva URL en el localStorage
  }

  // Método para obtener la URL de la foto de perfil
  getAvatarPhoto(): Observable<string> {
    return this.currentPhotoUrlSubject.asObservable();  // Regresar el observable para suscripción
  }
}
