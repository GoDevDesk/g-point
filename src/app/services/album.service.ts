import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedResultResponse } from '../models/paginatedResultResponse';
import { Album } from '../models/album';
import { Observable } from 'rxjs';
import { AlbumRequest } from '../models/albumRequest';
import { environment } from 'src/environments/environment';
import { albumPageData } from '../models/albumPageData';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  //private apiUrl = 'https://localhost:44306/api/album'; // URL base del backend
  private apiUrl = `${environment.apiPtFilesBaseUrl}/api/album`;  // Concatenar el subpath


  constructor(private http: HttpClient) { }

  getAlbumDataById(albumId: number): Observable<albumPageData> {
    const url = `${this.apiUrl}/data/${albumId}`;
    return this.http.get<albumPageData>(url);
  }

  getAlbumsByUserId(userId: number, page: number = 1, pageSize: number = 5): Observable<PaginatedResultResponse<Album>> {
    const params = new HttpParams()
      .set('id', userId.toString()) // El parámetro 'id' que el backend espera
      .set('page', page.toString()) // El número de página
      .set('pageSize', pageSize.toString()); // El tamaño de la página
      const url = `${this.apiUrl}/collection/${userId}`;
    // Realizar la petición GET a la API con los parámetros de paginación
    return this.http.get<PaginatedResultResponse<Album>>(url, { params });
  }

  createAlbum(newAlbum: AlbumRequest): Observable<number> {
    const url = `${this.apiUrl}`;

    // Crear un objeto FormData
    const formData = new FormData();
    formData.append('name', newAlbum.name);
    formData.append('price', newAlbum.price.toString());
    formData.append('userId', newAlbum.userId.toString());
    // Enviar el FormData
    return this.http.post<number>(url, formData);
  }

  updateAlbumInfo(albumId: number, title: string | null, price: number | null): Observable<void> {
    const url = `${this.apiUrl}/${albumId}`; // URL con el ID del álbum
    const body = {
      id: albumId,
      title: title,
      price: price
    };
  
    return this.http.put<void>(url, body);
  }


  isAlbumOwnerOrBuyer(userId: number): Observable<boolean> {
      const url = `${this.apiUrl}/access/${userId}`;
    return this.http.get<boolean>(url);
  }
}