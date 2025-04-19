import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Plan } from '../models/plan';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private apiUrl = `${environment.apiPtUsersBaseUrl}/api/plan`;  // Concatenar el subpath

  constructor(private http: HttpClient) { }

  createPlan(plan: Plan): Observable<any> {
    return this.http.post(this.apiUrl, plan);
  }

  haveAnyPlan(userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/have-any/${userId}`);
  }
}