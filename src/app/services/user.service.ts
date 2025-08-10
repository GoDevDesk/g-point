import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/userProfile';
import { environment } from 'src/environments/environment';
import { ForeignProfileData } from '../models/foreignProfileData';
import { ProfileData } from '../models/profileData';
import { PurchasingInfo } from '../models/purchasingInfo';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiPtUsersBaseUrl}/api`;

  constructor(private http: HttpClient) { }

  getUserById(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/user/${userId}`); 
  }

  getPurchasingInfo(): Observable<PurchasingInfo> {
    return this.http.get<PurchasingInfo>(`${this.apiUrl}/user/purchasing-info`);
  }

  updateUser(profileData: UserProfile): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/user`, profileData);
  }

  GetForeignProfileData(userId: number): Observable<ForeignProfileData> {
    return this.http.get<ForeignProfileData>(`${this.apiUrl}/foreign-profile/${userId}`); 
  }
}
