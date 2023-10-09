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
        label: 'Pipes de angular',
        icon: 'pi pi-desktop',
        items: [
          {
            label: 'Ingresos',
            icon: 'pi pi-align-left',
            routerLink: ''
          },
          {
            label: 'Ventas',
            icon: 'pi pi-dollar',
            routerLink: ''
          },
          {
            label: 'Balances',
            icon: 'pi pi-globe',
            routerLink: ''
          }
        ],
      },
      {
        label: 'Ajustes',
        icon: 'pi pi-cog'
      }
  ];

    }
  }
