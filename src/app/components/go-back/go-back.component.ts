import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common'; // Importa Location para
import { Router } from '@angular/router';

@Component({
  selector: 'app-go-back',
  templateUrl: './go-back.component.html',
  styleUrls: ['./go-back.component.scss']
})
export class GoBackComponent  {
  @Input() userId!: number; // Recibe el userId desde el componente padre


  constructor(private router: Router, private location: Location) { }

  goBack(): void {
    if (this.userId) {
      this.router.navigate([`/profile/${this.userId}`]); // Navega a la ruta profile/:id
    }else{
      this.location.back(); // Regresa a la página anterior      
  }
}
}