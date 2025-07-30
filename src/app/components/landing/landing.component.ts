import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  isLoggedIn: boolean = false;
  showBanner: boolean = true;
  categories = [
    {
      name: 'Fotografía',
      icon: 'fa-camera',
      count: 150
    },
    {
      name: 'Videos',
      icon: 'fa-video',
      count: 200
    },
    {
      name: 'Streaming',
      icon: 'fa-broadcast-tower',
      count: 100
    },
    {
      name: 'Arte',
      icon: 'fa-palette',
      count: 80
    }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUserIdLoggedBehavior()
      .pipe(map(userId => userId !== 0))
      .subscribe(isAuthenticated => {
        this.isLoggedIn = isAuthenticated;
      });
  }

  closeBanner(): void {
    this.showBanner = false;
  }
}
