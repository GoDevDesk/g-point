import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { authUser } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  currentUserLoggedId = ""
  constructor(private renderer: Renderer2, private el: ElementRef, private router: Router, private authService: AuthService) { }
  
  ngOnInit(): void {
    this.currentUserLoggedId = this.authService.getCurrentUserLoggedId().toString();
  }

  ngAfterViewInit() {
    const subscriptElement = this.el.nativeElement.querySelector('.mat-mdc-form-field-subscript-wrapper');
    if (subscriptElement) {
      this.renderer.removeChild(this.el.nativeElement, subscriptElement);
    }
  }
  navigateToProfile(): void {
    this.router.navigate([`profile/${this.currentUserLoggedId}`]);
  }

  navigateTo(route: string): void {
    debugger
    this.router.navigate([`/${route}`]);
  }

  logout(): void {
    this.authService.logout();
    // Lógica de cierre de sesión
    console.log('Cerrando sesión...');
  }
}