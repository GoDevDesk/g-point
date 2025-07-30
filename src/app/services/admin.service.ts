import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface RegistrationRequest {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: Date;
  motivo?: string;
  adminNotes?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  subscriptionType: 'free' | 'premium' | 'vip';
  status: 'active' | 'inactive' | 'blocked';
  registrationDate: Date;
  lastActivity: Date;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  newUsersThisMonth: number;
  premiumUsers: number;
}

export interface AdminFilters {
  search?: string;
  status?: string;
  subscriptionType?: string;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiPtUsersBaseUrl}/api/admin`;

  constructor(private http: HttpClient) {}

  // Obtener estadísticas del dashboard
  getDashboardStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/stats`);
  }

  // Obtener lista de usuarios con filtros
  getUsers(filters: AdminFilters = {}): Observable<{users: AdminUser[], total: number}> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.subscriptionType) params.append('subscriptionType', filters.subscriptionType);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    return this.http.get<{users: AdminUser[], total: number}>(`${this.apiUrl}/users?${params.toString()}`);
  }

  // Obtener detalles de un usuario específico
  getUserDetails(userId: string): Observable<AdminUser> {
    return this.http.get<AdminUser>(`${this.apiUrl}/users/${userId}`);
  }

  // Actualizar estado de un usuario (bloquear/desbloquear)
  updateUserStatus(userId: string, status: 'active' | 'blocked'): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${userId}/status`, { status });
  }

  // Eliminar un usuario
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }

  // Obtener reportes de contenido
  getContentReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reports`);
  }

  // Obtener estadísticas de ventas
  getSalesStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sales`);
  }

  // Obtener logs del sistema
  getSystemLogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/logs`);
  }

  // Gestión de solicitudes de registro
  getRegistrationRequests(): Observable<RegistrationRequest[]> {
    return this.http.get<RegistrationRequest[]>(`${this.apiUrl}/registration-requests`);
  }

  approveRegistrationRequest(requestId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/registration-requests/${requestId}/approve`, {});
  }

  rejectRegistrationRequest(requestId: string, motivo: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/registration-requests/${requestId}/reject`, { motivo });
  }

  deleteRegistrationRequest(requestId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/registration-requests/${requestId}`);
  }
} 