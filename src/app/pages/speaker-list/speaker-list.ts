/* eslint-disable no-useless-constructor */
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { DataService } from '../../data.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-speaker-list',
  templateUrl: 'speaker-list.html',
  styleUrls: ['./speaker-list.scss']
})

/** @class SpeakerListPage Tab */
export class SpeakerListPage implements OnInit {
  veranstalter: Object = [];
  speakernamevar: any = '';

  /**
   * Creates an instance of SchedulePage.
   *
   * @constructor
   * @param {DataService} dataService Service for HTTP requests and storage operations.
   * @param {LoadingController} loadingController Loading controller to display loading status.
   * @param {Storage} storage Storage to save data offline.
   */
  constructor(
    private dataService: DataService,
    private loadingController: LoadingController,
    private storage: Storage
  ) {}

  /**
   * Calls loading function after opening the tab.
   */
  ngOnInit() {
    this.loadVeranstalter();
  }

  /**
   * Calls loading function when opening the tab.
   */
  ionViewWillEnter() {
    this.loadVeranstalter();
  }

  /**
   * es werden alle Aussteller aus dem Storge aufgerufen
   */
  async loadVeranstalter() {
    // lade aus storage
    this.storage.get('veranstalterStorage').then((val) => {
      this.veranstalter = val;
    });
    // lade den eventtitel aus dem speicher und speichere ihn in der zu displayenden variable
    this.storage.get('eventTitel').then((val) => {
      this.speakernamevar = val;
    });
  }
}
