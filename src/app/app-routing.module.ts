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
    path: 'profile/:id', component: ProfileComponent
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
    path: 'album-detail/:albumId', component: AlbumDetailComponent
  },
  {
    path: 'chat', component: ChatBoxComponent,
    canActivate: [AuthGuard] 
  }
  // },
  // {
  //   path:"*",
  //   //component: PageNotFoundComponent,

  // }

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
