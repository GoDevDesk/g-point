import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
  
  items: MenuItem[] = []
  private excludedRoutes = ['/login', '/register'];

  constructor(private _router: Router) { }

  ngOnInit(): void {
    this.items = this._addItems();
  }

  shouldShowMenu(): boolean {
    return !this.excludedRoutes.some(route => this._router.url.includes(route));
  }

  private _addItems():MenuItem[]{
    return [
      {
        label: 'Vender',
        icon: 'pi pi-dollar',
        items: [
          {
            label: 'Promociones',
            icon: 'pi pi-dollar'
          }
        ]
      },
      {
        label: 'Stock',
        icon: 'pi pi-table',
        items: [
          {
            label: 'Carga de Stock',
            icon: 'pi pi-dollar'
          },
          {
            label: 'mis Productos',
            icon: 'pi pi-dollar'
          },
          {
            label: 'Vencimientos',
            icon: 'pi pi-dollar'
          },
          {
            label: 'Poco Stock',
            icon: 'pi pi-dollar'
          }
        ]
      },
      {
        label: 'Finanzas',
        icon: 'pi pi-money-bill'
      },
      {
        label: 'Informacion',
        icon: 'pi pi-chart-line',
        
      }
  ];

    }
  }
