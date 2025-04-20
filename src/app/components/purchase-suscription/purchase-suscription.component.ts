import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanService } from 'src/app/services/plan.service';
import { Plan } from 'src/app/models/plan';

@Component({
  selector: 'app-purchase-suscription',
  templateUrl: './purchase-suscription.component.html',
  styleUrls: ['./purchase-suscription.component.scss']
})
export class PurchaseSuscriptionComponent implements OnInit {
  plan: Plan | null = null;
  isLoading = false;
  profileId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private planService: PlanService
  ) {}

  ngOnInit(): void {
    this.profileId = this.route.snapshot.paramMap.get('id') || '';
  //  this.loadPlan();
  }

  loadPlan(): void {
    this.isLoading = true;
    this.planService.getByUserId(Number(this.profileId)).subscribe({
      next: (response) => {
        this.plan = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar el plan:', error);
        this.isLoading = false;
        this.router.navigate(['/']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/profile', this.profileId]);
  }

  proceedToPayment(): void {
    // Aquí se implementará la lógica para redirigir a Mercado Pago
    console.log('Procediendo al pago con Mercado Pago');
    // this.router.navigate(['/mercadopago', this.plan?.id]);
  }
}
