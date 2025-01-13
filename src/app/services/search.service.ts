import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  //private apiUrl = 'https://localhost:44335/api'; // URL base del backend
  private apiUrl = `${environment.apiPtUsersBaseUrl}/api/search`;  // Concatenar el subpath


  constructor(private http: HttpClient) {}

  search(query: string): Observable<any[]> {
    if (!query.trim()) {
      return new Observable((observer) => observer.next([])); // Si el query está vacío, devuelve un array vacío
    }
    return this.http.get<any[]>(`${this.apiUrl}?query=${query}`);
  }
}
