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
  isEditPriceModalOpen = false;
  newPrice: number = 0;
  isSavingPrice = false;

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
    this.isSavingPrice = true;
    if (this.plan) {
      this.plan.active = !this.isPlanActive;
      this.planService.changeStatus(this.plan).subscribe({
        next: (response) => {
          this.isPlanActive = !this.isPlanActive;          
          this.isLoading = false;
          this.isSavingPrice = false;
        },
        error: (error) => {
          console.error('Error al cambiar el estado del plan:', error);
          this.isLoading = false;
          this.isSavingPrice = false;
        }
      });
    }
  }

  openEditPriceModal(): void {
    this.newPrice = this.plan?.price || 0;
    this.isEditPriceModalOpen = true;
  }

  closeEditPriceModal(): void {
    this.isEditPriceModalOpen = false;
    this.newPrice = 0;
  }

  onSubmitEditPrice(): void {
    if (!this.plan || this.newPrice <= 0) return;

    this.isLoading = true;
    this.plan.price = this.newPrice;
    
    this.planService.changePrice(this.plan).subscribe({
      next: (response) => {
        this.plan = response;
        this.isLoading = false;
        this.isEditPriceModalOpen = false;
        alert('Precio actualizado exitosamente');
      },
      error: (error) => {
        console.error('Error al actualizar el precio:', error);
        this.isLoading = false;
        alert('Error al actualizar el precio. Por favor, intente nuevamente.');
      }
    });
  }
}
