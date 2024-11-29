
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
import { HttpClientModule } from '@angular/common/http';

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
  // providers: [OwnauthService], // Registro del servicio
  bootstrap: [AppComponent],
  providers: [AuthService]
})
export class AppModule { }
