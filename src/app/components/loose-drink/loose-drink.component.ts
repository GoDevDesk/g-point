import { Component, OnInit } from '@angular/core';
import { DonationService } from 'src/app/services/donation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Donation } from 'src/app/models/donation';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-loose-drink',
  templateUrl: './loose-drink.component.html',
  styleUrls: ['./loose-drink.component.scss']
})
export class LooseDrinkComponent implements OnInit {
  constructor(
    private donationService: DonationService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.donationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(5)]],
      amount: ['', [Validators.required, Validators.min(1)]],
      currency: ['ARS', [Validators.required]]
    });
  }

  profileId: string = '';
  isExpanded = false; // Estado para controlar si la tarjeta está desplegada o no
  donationForm: FormGroup;
  isSubmitting = false;
  currencies = [
    { code: 'ARS', name: 'Pesos Argentinos' },
    { code: 'USD', name: 'Dólares Estadounidenses' }
  ];

  ngOnInit(): void {
    this.profileId = this.route.snapshot.paramMap.get('id') || '';
  }

  // Método para alternar el estado de la tarjeta
  toggleCard() {
    this.isExpanded = !this.isExpanded;
  }

  sendDonation() {
    if (this.donationForm.valid) {
      this.isSubmitting = true;
      const donation: Donation = {
        donorName: this.donationForm.value.name,
        message: this.donationForm.value.message,
        amount: this.donationForm.value.amount,
        currency: this.donationForm.value.currency,
        userId: Number(this.profileId)
      };

      this.donationService.createDonation(donation).subscribe({
        next: (response) => {
          console.log('Donación enviada:', response);
          this.donationForm.reset();
          this.isExpanded = false;
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error al enviar donación:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  // Métodos para acceder a los controles del formulario
  get name() { return this.donationForm.get('name'); }
  get message() { return this.donationForm.get('message'); }
  get amount() { return this.donationForm.get('amount'); }
  get currency() { return this.donationForm.get('currency'); }
}
