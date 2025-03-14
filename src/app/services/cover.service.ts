import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CoverPicture } from '../models/coverPicture';

@Injectable({
  providedIn: 'root',
})
export class CoverService {
  private apiUrl = `${environment.apiPtFilesBaseUrl}/api/cover-picture`;  // Concatenar el subpath
  private currentPhotoUrlSubject = new BehaviorSubject<string>('');
  currentPhotoUrl$ = this.currentPhotoUrlSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  createPhoto(file: File, userId: string): Observable<any> {
    const formData = new FormData();
    formData.append('multimedia', file);
    formData.append('userId', userId);
    formData.append('description', 'asd');

    return this.http.post(`${this.apiUrl}`, formData);
  }

  updatePhoto(file: File, coverPictureId: number): Observable<any> {
    const formData = new FormData();
    formData.append('multimedia', file);
    formData.append('id', coverPictureId.toString());
    return this.http.put(`${this.apiUrl}`, formData)
  }

  getCoverPhoto(userId: number): Observable<CoverPicture> {
    // Realiza la solicitud HTTP y ejecuta setAvatarPhoto cuando llegue la respuesta
    return this.http.get<CoverPicture>(`${this.apiUrl}/user/${userId}`).pipe(
      tap((photoUrl: CoverPicture) => {
        const newPhotoUrl = photoUrl.url_File;
      })
    );
  }

    deleteCoverPhoto(userId: number, coverPictureId: number): Observable<{ message: string }> {
      return this.http.delete<{ message: string }>(`${this.apiUrl}/user/${userId}/${coverPictureId}`).pipe(
        tap(response => {
          console.log(response.message);
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.error?.message || "No se pudo eliminar la foto"));
        })
      );
    }
}
