import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
 // private apiUrl = 'https://localhost:44306/api/profile-picture'; // Cambia la URL según la ruta de tu servidor.

  private apiUrl = `${environment.apiPtUsersBaseUrl}/api/profile-picture`;  // Concatenar el subpath
  

  constructor(private http: HttpClient) {}

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

    return this.http.put(`${this.apiUrl}`, formData);
  }

  getProfilePhoto(userId: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/user/${userId}`);
  }
}
