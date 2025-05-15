import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanService } from 'src/app/services/plan.service';
import { Plan } from 'src/app/models/plan';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-purchase-suscription',
  templateUrl: './purchase-suscription.component.html',
  styleUrls: ['./purchase-suscription.component.scss']
})
export class PurchaseSuscriptionComponent implements OnInit {
  plan: Plan | null = null;
  isLoading = false;
  productId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private planService: PlanService,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('productid') || '';
    //  this.loadPlan();
  }
  /* TENGO QUE TRAER TODA LA INFORMACION DEL PRODUCTO SUBSCRIPCION Y ACLARAR DE QUE SE TRATA*/
  loadProduct(): void {
    this.isLoading = true;
 /*   this.planService.getByUserId(Number(this.profileId)).subscribe({
      next: (response) => {
        this.plan = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar el plan:', error);
        this.isLoading = false;
        this.router.navigate(['/']);
      }
    });*/
  }

  goBack(): void {
    //  this.router.navigate(['/profile', this.profileId]);
  }

  proceedToPayment(): void {
    this.paymentService.createPurchase(Number(this.productId)).subscribe({
      next: (response) => {
        window.location.href = response.initPoint;
      },
      error: (error) => {
        console.error('Error al crear el pago:', error);
      }
    });
  }
}
