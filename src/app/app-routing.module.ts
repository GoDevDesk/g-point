import { RegisterComponent } from './components/register/register.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component'
import { ProfileComponent } from './components/profile/profile.component';
import { AlbumContentComponent } from './components/album-content/album-content.component';
import { AlbumDetailComponent } from './components/album-detail/album-detail.component';
import { AuthGuard } from './guard/auth.guard';
import { NotFoundError } from 'rxjs';
import { ChatBoxComponent } from './components/chat-box/chat-box.component';
import { AuthNoLoggedGuard } from './guard/auth-no-logged.guard';
import { AuthBuyerGuard } from './guard/auth-buyer.guard';
import { AuthProfileGuard } from './guard/auth-profile.guard';
import { ProfileNotFoundComponent } from './components/profile-not-found/profile-not-found.component';
import { AuthPurchaseSuscriptionGuard } from './guards/auth-purchase-suscription.guard';
import { PurchaseSuscriptionComponent } from './components/purchase-suscription/purchase-suscription.component';
import { HomeComponent } from './components/home/home.component';
import { ReportComponent } from './components/report/report.component';
import { AuthReportGuard } from './guard/auth-report.guard';
import { ConfigurationComponent } from './components/configuration/configuration.component';


const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login', component: LoginComponent,
    canActivate: [AuthNoLoggedGuard] 
  },
  {
    path: 'register', component: RegisterComponent,
    canActivate: [AuthNoLoggedGuard] 
  },
  {
    path: 'profile/:id', component: ProfileComponent,
    canActivate: [AuthProfileGuard] 
  },
  {
    path: 'profile-not-found', component: ProfileNotFoundComponent
  },
  {
    path: 'albumContent/:albumId', component: AlbumContentComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: 'albumContent', component: AlbumContentComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: 'album-detail/:albumId', component: AlbumDetailComponent,
    canActivate: [AuthBuyerGuard] 
  },
  {
    path: 'chat', component: ChatBoxComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: 'purchase-suscription', component: PurchaseSuscriptionComponent,
    canActivate: [AuthPurchaseSuscriptionGuard] 
  },
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'report-content', component: ReportComponent,
    canActivate: [AuthReportGuard]
  },
  {
    path: 'configuration', component: ConfigurationComponent,
    canActivate: [AuthGuard]
  },
   {
     path:"*",
     component: HomeComponent
   }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
