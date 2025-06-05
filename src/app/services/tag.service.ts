import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Tag {
  id: number;
  name: string;
  isCustom: boolean;
  usageCount: number;
  isSelected?: boolean;
}

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
  createCustomTag(tagName: string): Observable<Tag> {
    return this.http.post<Tag>(`${this.apiUrl}/custom`, tagName);
  }

  // Remover una etiqueta de un usuario
  removeTagFromUser(userId: number, tagId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${tagId}`);
  }

}
