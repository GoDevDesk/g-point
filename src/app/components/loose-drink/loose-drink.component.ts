import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loose-drink',
  templateUrl: './loose-drink.component.html',
  styleUrls: ['./loose-drink.component.scss']
})
export class LooseDrinkComponent{

  isExpanded = false; // Estado para controlar si la tarjeta está desplegada o no
  sliderValue = 1; // Valor inicial del slider

  // Método para alternar el estado de la tarjeta
  toggleCard() {
    this.isExpanded = !this.isExpanded;
  }
}
