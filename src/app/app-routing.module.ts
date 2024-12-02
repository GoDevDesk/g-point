import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component'
import { ProfileComponent } from './components/profile/profile.component';
import { AlbumContentComponent } from './components/album-content/album-content.component';
import { AlbumDetailComponent } from './components/album-detail/album-detail.component';


const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'profile/:id', component: ProfileComponent
  },
  {
    path: 'albumContent/:albumId', component: AlbumContentComponent
  },
  {
    path: 'album-detail/:id', component: AlbumDetailComponent
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
