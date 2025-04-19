import { Component, OnInit } from '@angular/core';
import { PlanService } from 'src/app/services/plan.service';
import { AuthService } from 'src/app/services/auth.service';
import { Plan } from 'src/app/models/plan';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mensual-suscription',
  templateUrl: './mensual-suscription.component.html',
  styleUrls: ['./mensual-suscription.component.scss']
})
export class MensualSuscriptionComponent implements OnInit {
  plan: Plan | null = null;
  isLoading = false;
  isPlanActive = true;
  isOwner: boolean = false;
  profileId: string = ''; // ID del perfil visitado

  constructor(
    private route: ActivatedRoute,
    private planService: PlanService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.profileId = this.route.snapshot.paramMap.get('id') || '';
    this.route.paramMap.subscribe(params => {
      this.profileId = params.get('id') || ''; // Capturar el nuevo ID de la URL
      this.loadPlan();
    });
  }

  loadPlan(): void {
    this.isOwner = this.authService.isProfileOwner(this.profileId);
    this.isLoading = true;
   // const userId = this.authService.CurrentUserLoggedId;
    this.planService.getByUserId(Number(this.profileId)).subscribe({
      next: (response) => {
        this.plan = response;
        this.isPlanActive = response.active;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar el plan:', error);
        this.isLoading = false;
      }
    });
  }

  togglePlanStatus(): void {
    this.isLoading = true;
    if (this.plan) {
      this.plan.active = !this.isPlanActive;
      this.planService.changeStatus(this.plan).subscribe({
        next: (response) => {
          this.isPlanActive = !this.isPlanActive;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cambiar el estado del plan:', error);
          this.isLoading = false;
        }
      });
    }
  }
}
