import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PrivacySettings, PrivacySettingsRequest, PrivacySettingsResponse } from '../models/privacy-settings';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private apiUrl = `${environment.apiPtUsersBaseUrl}/api/configuration`;

  constructor(private http: HttpClient) { }

  getPrivacySettings(): Observable<PrivacySettingsResponse> {
    return this.http.get<PrivacySettingsResponse>(`${this.apiUrl}/privacy-settings`);
  }

  toggleChat(request: PrivacySettingsRequest): Observable<any> {
    const privacySettings: PrivacySettings = {
      userId: request.userId,
      enabledChat: request.enabledChat ?? false,
      receiveEmailNotifications: false
    };
    return this.http.post(`${this.apiUrl}/toggle-chat`, privacySettings);
  }

  toggleEmailNotifications(request: PrivacySettingsRequest): Observable<any> {
    const privacySettings: PrivacySettings = {
      userId: request.userId,
      enabledChat: false,
      receiveEmailNotifications: request.receiveEmailNotifications ?? false
    };
    return this.http.post(`${this.apiUrl}/toggle-email-notifications`, privacySettings);
  }
}
