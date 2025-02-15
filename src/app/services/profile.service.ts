import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProfilePicture } from '../models/profilePicture';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = `${environment.apiPtFilesBaseUrl}/api/profile-picture`;
  private currentPhotoUrlSubject = new BehaviorSubject<string>('');
  currentPhotoUrl$ = this.currentPhotoUrlSubject.asObservable();


  constructor(private http: HttpClient) {

    const storedAvatar = localStorage.getItem('avatarUrl');
    this.currentPhotoUrlSubject = new BehaviorSubject<string>(storedAvatar || '');
  }

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
      })
    );
  }

  deleteProfilePhoto(userId: number, profilePictureId:number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/user/${userId}/${profilePictureId}`).pipe(
      tap(response => {
        console.log(response.message);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.error?.message || "No se pudo eliminar la foto"));
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
