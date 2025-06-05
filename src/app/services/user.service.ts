import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/userProfile';
import { environment } from 'src/environments/environment';
import { ForeignProfileData } from '../models/foreignProfileData';
import { ProfileData } from '../models/profileData';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiPtUsersBaseUrl}/api`;

  constructor(private http: HttpClient) { }

  // Método para obtener la información del usuario por ID
  getUserById(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/user/${userId}`); // Asumimos que el endpoint es /user/profile/:id
  }

  // Método para actualizar la información del usuario por ID
  updateUser(profileData: ProfileData): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/user`, profileData);
  }

  // Método para obtener la información del usuario por ID
  GetForeignProfileData(userId: number): Observable<ForeignProfileData> {
    return this.http.get<ForeignProfileData>(`${this.apiUrl}/foreign-profile/${userId}`); // Asumimos que el endpoint es /user/profile/:id
  }
}
