import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'; // Importa Location para

@Component({
  selector: 'app-go-back',
  templateUrl: './go-back.component.html',
  styleUrls: ['./go-back.component.scss']
})
export class GoBackComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit(): void {
  }
  goBack(): void {
    this.location.back(); // Regresa a la página anterior
  }
}
