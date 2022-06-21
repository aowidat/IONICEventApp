import { async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SchedulePage } from './schedule';
import { IonicModule, AlertController, LoadingController, Platform, PopoverController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Network } from '@ionic-native/network/ngx';
import { DataService } from '../../data.service';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';

describe('SchedulePage', () => {
  let component: SchedulePage;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SchedulePage],
      imports: [FormsModule, IonicModule, // SharedScheduleModule,
        IonicModule.forRoot(), RouterModule.forRoot([]), HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));
  it('should create', () => {
    component = new SchedulePage(PopoverController.prototype, HttpClient.prototype, DataService.prototype,
      LoadingController.prototype, Storage.prototype, Network.prototype, AlertController.prototype, Platform.prototype);
  });
  it('should load veranstaltungen', () => {
    component = new SchedulePage(PopoverController.prototype, HttpClient.prototype, DataService.prototype,
      LoadingController.prototype, Storage.prototype, Network.prototype, AlertController.prototype, Platform.prototype);
    component.getVeranstlatung();
  });
});
