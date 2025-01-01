
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';



import { environment } from 'src/environments/environment';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from './shared/shared.module';
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
import { EditPhotoModalComponent } from './components/edit-photo-modal/edit-photo-modal.component';
import { CreatePostModalComponent } from './components/create-post-modal/create-post-modal.component';
import { GoBackComponent } from './components/go-back/go-back.component';
import { ChatComponent } from './components/chat/chat.component';
import { ChatBoxComponent } from './components/chat-box/chat-box.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    AlbumsGridComponent,
    ToolbarFooterComponent,
    PersonalPhotosComponent,
    DrinksComponent,
    MensualSuscriptionComponent,
    LooseDrinkComponent,
    AlbumContentComponent,
    AlbumDetailComponent,
    EditPhotoModalComponent,
    CreatePostModalComponent,
    GoBackComponent,
    ChatComponent,
    ChatBoxComponent,
  ],
  imports: [
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    HttpClientModule,
    MatProgressSpinnerModule
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
