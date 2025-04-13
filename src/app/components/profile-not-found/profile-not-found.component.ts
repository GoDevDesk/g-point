import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-not-found',
  templateUrl: './profile-not-found.component.html',
  styleUrls: ['./profile-not-found.component.scss']
})
export class ProfileNotFoundComponent {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }
} 