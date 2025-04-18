import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Donation } from '../models/donation';

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  private apiUrl = `${environment.apiPtUsersBaseUrl}/api/donation`;

  constructor(private http: HttpClient) {
  }

  createDonation(donation: Donation): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.http.post<any>(url, donation);
  }
}
