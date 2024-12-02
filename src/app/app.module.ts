
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AngularFireModule} from '@angular/fire/compat'
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';

import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from './shared/shared.module';
import { PrimeNgModule } from './prime-ng/prime-ng.module';
import { ProfileComponent } from './components/profile/profile.component';
import { AlbumsGridComponent } from './components/albums-grid/albums-grid.component';
import { ToolbarFooterComponent } from './components/toolbar-footer/toolbar-footer.component';
import { PersonalPhotosComponent } from './components/personal-photos/personal-photos.component';
import { DrinksComponent } from './components/drinks/drinks.component';
import { AuthService } from './services/auth.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MensualSuscriptionComponent } from './components/mensual-suscription/mensual-suscription.component';
import { LooseDrinkComponent } from './components/loose-drink/loose-drink.component';
import { AlbumContentComponent } from './components/album-content/album-content.component';
import { AlbumDetailComponent } from './components/album-detail/album-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    AlbumsGridComponent,
    ToolbarFooterComponent,
    PersonalPhotosComponent,
    DrinksComponent,
    MensualSuscriptionComponent,
    LooseDrinkComponent,
    AlbumContentComponent,
    AlbumDetailComponent,
  ],
  imports: [
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    PrimeNgModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent],
  providers: [AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true, // Permite múltiples interceptores si se agregan otros en el futuro
    },
  ]
})
export class AppModule { }
