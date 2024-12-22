import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedResultResponse } from '../models/paginatedResultResponse';
import { Album } from '../models/album';
import { Observable } from 'rxjs';
import { Post } from '../models/Post';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
 // private apiUrl = 'https://localhost:44306/api/post'; // URL base del backend
  private apiUrl = `${environment.apiPtFilesBaseUrl}/api/post`;  // Concatenar el subpath
  

  constructor(private http: HttpClient) { }

  getPostsByAlbumId(albumId: number, page: number = 1, pageSize: number = 5): Observable<PaginatedResultResponse<Post>> {
    const params = new HttpParams()
      .set('page', page.toString()) // El número de página
      .set('pageSize', pageSize.toString()); // El tamaño de la página
    const url = `${this.apiUrl}/album/${albumId}`;
    // Realizar la petición GET a la API con los parámetros de paginación
    return this.http.get<PaginatedResultResponse<Post>>(url, { params });
  }

  createPost(file: File, albumId: string, userId: string): Observable<any> {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('albumId', albumId);
    formData.append('multimedia', file);
    formData.append('description', 'asd');

    return this.http.post(`${this.apiUrl}`, formData);
  }

}