import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, throwError } from 'rxjs';
import { PaginatedResultResponse } from '../models/paginatedResultResponse';
import { PersonalPhoto } from '../models/PersonalPhoto';

@Injectable({
  providedIn: 'root'
})
export class PersonalPhotosService {
private apiUrl = `${environment.apiPtFilesBaseUrl}/api/personal-photos`; 
  

constructor(private http: HttpClient) { }

getPersonalPhotosByUserId(userId: number, page: number = 1, pageSize: number = 5): Observable<PaginatedResultResponse<PersonalPhoto>> {
  const params = new HttpParams()
    .set('page', page.toString()) 
    .set('pageSize', pageSize.toString());
  const url = `${this.apiUrl}/${userId}`;
  return this.http.get<PaginatedResultResponse<PersonalPhoto>>(url, { params });
}

createPersonalPhoto(file: File, userId: string): Observable<any> {
  const formData = new FormData();
  formData.append('userId', userId);
  formData.append('multimedia', file);

  return this.http.post(`${this.apiUrl}`, formData);
}

deletePersonalPhoto( userId: number, personalPhotoId: number): Observable<boolean> {
  const url = `${this.apiUrl}/user/${userId}/${personalPhotoId}`;    
  return this.http.delete<boolean>(url).pipe(
    catchError(error => {
      console.error('Error al eliminar la foto personal:', error);
      return throwError(() => error);
    })
  );
}
}