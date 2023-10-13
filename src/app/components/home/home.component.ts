import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  sales = [
    { id: 1, time: '14:30', product: 'Papas Fritas', total: 400 },
    { id: 2, time: '15:15', product: 'Refresco Coca-Cola', total: 800},
    { id: 3, time: '15:15', product: 'Pancho', total: 450 },
    { id: 4, time: '15:15', product: 'Refresco Coca-Cola', total: 800 },
    { id: 5, time: '15:15', product: 'Refresco Coca-Cola', total: 800 },
    // ... otros registros de ventas ...
  ];
  expenses = [
    { id: 1, time: '14:30', disbursement: 'Alquiler', total: 40000 },
    { id: 2, time: '15:15', disbursement: 'Proveedor gaseosa', total: 18000},
    { id: 3, time: '15:15', disbursement: 'libreria', total: 450 },
    { id: 4, time: '15:15', disbursement: 'fumigacion', total: 5000 }
    // ... otros registros de ventas ...
  ];
  public sidebarVisible = true;
  constructor(private authService:AuthService) { }

  ngOnInit(): void {
  }

  logout(){
    this.authService.logout()
  }
}
