import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {ToastModule} from 'primeng/toast';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { MessageService } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';

@NgModule({
  exports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    MenubarModule,
    CardModule
  ],
  providers: [MessageService],
})
export class PrimeNgModule { }
