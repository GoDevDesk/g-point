import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedResultResponse } from '../models/paginatedResultResponse';
import { Album } from '../models/album';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private apiUrl = 'https://localhost:44306/api/album'; // URL base del backend

  constructor(private http: HttpClient) { }

  getAlbumsByUserId(userId: number, page: number = 1, pageSize: number = 5): Observable<PaginatedResultResponse<Album>> {
    const params = new HttpParams()
      .set('id', userId.toString()) // El parámetro 'id' que el backend espera
      .set('page', page.toString()) // El número de página
      .set('pageSize', pageSize.toString()); // El tamaño de la página
      const url = `${this.apiUrl}/collection/${userId}`;
    // Realizar la petición GET a la API con los parámetros de paginación
    return this.http.get<PaginatedResultResponse<Album>>(url, { params });
  }
}