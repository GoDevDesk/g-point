import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BlockedUserResponse } from '../models/blockedUser';

@Injectable({
  providedIn: 'root'
})
export class BlockedUsersService {
  private apiUrl = `${environment.apiPtUsersBaseUrl}/api/blocked-users`;

  constructor(private http: HttpClient) { }

  GetBlockedUsers(): Observable<BlockedUserResponse[]> {
    return this.http.get<BlockedUserResponse[]>(`${this.apiUrl}`);
  }

  toggleBlockedUser(blockedUserId: number): void {
    this.http.post(`${this.apiUrl}/toggle`, blockedUserId);
  }
}
