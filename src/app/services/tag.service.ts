import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private apiUrl = `${environment.apiPtUsersBaseUrl}/api/tag`;

  constructor(private http: HttpClient) { }

  // Obtener todas las etiquetas disponibles
  getAvailableTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiUrl}/default`);
  }

  // Obtener las etiquetas seleccionadas por un usuario
  getUserTags(userId: number): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiUrl}/selected/${userId}`);
  }

  // Agregar una etiqueta a un usuario
  addTagToUser(tagId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add-to-user/${tagId}`, {});
  }
  
  // Crear una nueva etiqueta personalizada
  createCustomTag(tagName: string): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/custom`, `"${tagName}"`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Remover una etiqueta de un usuario
  removeTagFromUser(userId: number, tagId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${tagId}`);
  }

}
