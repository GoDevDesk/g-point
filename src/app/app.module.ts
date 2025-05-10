import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { environment } from 'src/environments/environment';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CreateAlbumModalComponent } from './components/create-album-modal/create-album-modal.component';
import { CreatePlanModalComponent } from './components/create-plan-modal/create-plan-modal.component';
import { PurchaseSuscriptionComponent } from './components/purchase-suscription/purchase-suscription.component';
import { HomeComponent } from './components/home/home.component';

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
    ToolbarComponent,
    CreateAlbumModalComponent,
    CreatePlanModalComponent,
    PurchaseSuscriptionComponent,
    HomeComponent
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
    MatProgressSpinnerModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ],
  bootstrap: [AppComponent],
  providers: [AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ]
})
export class AppModule { }
