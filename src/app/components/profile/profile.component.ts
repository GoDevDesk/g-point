import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  items: MenuItem[] = [];
  activeTab: string = 'albums';

  profileId: string = ''; // ID del perfil visitado
  isOwner: boolean = false; // Indica si el usuario actual es dueño del perfil

  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    this.items = [
      { label: 'Dashboard' },
      { label: 'Transactions' },
      { label: 'Products' }
    ]
    // Obtener el ID del perfil desde la URL
    this.profileId = this.route.snapshot.paramMap.get('id') || '';

    // Verificar si el usuario logueado es dueño del perfil
    this.isOwner = this.authService.isProfileOwner(this.profileId);
  }
}
