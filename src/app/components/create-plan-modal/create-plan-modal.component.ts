import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanService } from 'src/app/services/plan.service';
import { Plan } from 'src/app/models/plan';

@Component({
  selector: 'app-create-plan-modal',
  templateUrl: './create-plan-modal.component.html',
  styleUrls: ['./create-plan-modal.component.scss']
})
export class CreatePlanModalComponent {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() planCreated = new EventEmitter<void>();

  planForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private planService: PlanService
  ) {
    this.planForm = this.fb.group({
      price: ['', [Validators.required, Validators.min(1)]]
    });
  }

  closeModal(): void {
    this.planForm.reset();
    this.close.emit();
  }

  onSubmit(): void {
    if (this.planForm.valid) {
      this.isLoading = true;
      const plan: Plan = {
        id: 0,
        userId: 0, // Se asignará en el backend
        price: this.planForm.value.price,
        active: true
      };

      this.planService.createPlan(plan).subscribe({
        next: () => {
          this.isLoading = false;
          alert('¡Plan creado exitosamente!');
          this.planCreated.emit();
          this.closeModal();
        },
        error: (error) => {
          this.isLoading = false;
          alert('Error al crear el plan. Por favor, intente nuevamente.');
          this.closeModal();
        }
      });
    }
  }
}
