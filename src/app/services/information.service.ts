import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Information } from '../models/information';

@Injectable({
  providedIn: 'root'
})
export class InformationService {
  private apiUrl = `${environment.apiPtUsersBaseUrl}/api/information`;

  constructor(private http: HttpClient) { }
  getInformation(): Observable<Information> {
    return this.http.get<Information>(`${this.apiUrl}`);
  }
}