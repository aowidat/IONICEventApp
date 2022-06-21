import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionDetailPage } from './session-detail';
import { SessionDetailPageRoutingModule } from './session-detail-routing.module';
import { IonicModule } from '@ionic/angular';
import { IonicRatingModule } from 'ionic4-rating/dist';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SessionDetailPageRoutingModule,
    IonicRatingModule,
    FormsModule
  ],
  declarations: [
    SessionDetailPage
  ]
})

/** @class Module for SessionDetailPage */
export class SessionDetailModule { }
