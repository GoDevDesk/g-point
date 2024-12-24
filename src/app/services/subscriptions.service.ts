import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {

  private apiUrl = `${environment.apiPtUsersBaseUrl}/api`;  // Concatenar el subpath

  constructor(private http: HttpClient) { }

  updateSubscribeStatus(userId: number, active: boolean): Observable<any> {
    const body = { userId, active };
    return this.http.post(`${this.apiUrl}/subscription`, body);
  }
}
