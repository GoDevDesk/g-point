import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiPtUsersBaseUrl}/api/payment`;

  constructor(private http: HttpClient) {
  }

  createPurchase(productId: number): Observable<any> {
    const url = `${this.apiUrl}/create-purchase/${productId}`;
    return this.http.post<any>(url, {}); // Se envía un body vacío
  }
}
