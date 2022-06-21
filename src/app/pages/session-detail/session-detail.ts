/* eslint-disable no-useless-constructor */
/* eslint-disable no-unused-vars */
/* eslint-disable handle-callback-err */
/* eslint-disable indent */
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Platform, LoadingController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../data.service';
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { BrowserTab } from '@ionic-native/browser-tab/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Device } from '@ionic-native/device/ngx';

@Component({
  selector: 'page-session-detail',
  styleUrls: ['./session-detail.scss'],
  templateUrl: 'session-detail.html'
})

/** @class SessionDetailPage Tab */
export class SessionDetailPage implements OnInit {
  veranstaltung;
  id;
  fav = false;
  token;
  rate = 0;
  bewertungsnachricht: string;
  sessionnamevar: any = '';
  ort: any;
  ortID;
  bewertenVerbieten = false;
  bewertung: any = [];

  /**
   * Creates an instance of SchedulePage.
   *
   * @constructor
   * @param {HttpClient} http Client for HTTP requests.
   * @param {DataService} dataService Service for HTTP requests and storage operations.
   * @param {LoadingController} loadingController Loading controller to display loading status.
   * @param {Storage} storage Storage to save data offline.
   * @param {Network} network Network to get info about the internet connection.
   * @param {Platform} platform Platform to get info about the operating system.
   * @param {ActivatedRoute} route Activated Route for Routing.
   * @param {BrowserTab} browserTab Browser tab to open URLs in the app.
   * @param {DocumentViewer} document Viewer to open documents in the app.
   * @param {File} file File to get opened.
   * @param {FileTransfer} fileTransfer File transfer to download files.
   * @param {ChangeDetectorRef} changeDetectorRef provides change detection functionality for angular views
   * @param {Device} device used to access information about the underlying device/platform
   * @param {ToastController} toastController used to display a subtle notification
   */
  constructor(private loadingController: LoadingController, private route: ActivatedRoute, private dataService: DataService,
              private storage: Storage, private network: Network, private platform: Platform, private browserTab: BrowserTab,
              private changeDetectorRef: ChangeDetectorRef,
              private document: DocumentViewer,
              private file: File,
              private fileTransfer: FileTransfer,
              private http: HttpClient,
              private device: Device,
              public toastController: ToastController
  ) {}

  /**
   * Loads veranstaltung data after opening the tab.
   */
  ngOnInit() {
    this.loadSessionFeed();
    this.id = this.route.snapshot.paramMap.get('sessionId');
    this.storage.get(this.id.toString()).then((val) => {
      this.fav = val;
    });
    this.storage.get('veranstaltungStorage').then((val) => {
      // lade veranstaltungen aus storage
      // ordne jede veranstaltung der richtigen stelle zu
      for (let i = 0; i < val.length; i++) {
        if (val[i].id === parseInt(this.id)) {
          // Ort ID speichern
          this.ortID = val[i].ort.ID;
          this.veranstaltung = val[i];
        }
      }
    });
    this.doCheckBewertung();
    // Ort Laden
    this.getOrt();
    // lade token aus storage fuer bewertung
    this.storage.get('token').then((val) => {
      this.token = val;
    });
  }

  /**
   * Gets veranstaltungs-id when opening the page
   */
  ionViewWillEnter() {
    this.storage.get(this.id.toString()).then((val) => {
      this.fav = val;
    });
  }

  /**
   * wird der Ort der Veranstaltung aus dem Speicher geladen
   */
  getOrt() {
    this.storage.get('orteStorage').then(val => {
      for (let i = 0; i < val.length; i++) {
        if (val[i].id === this.ortID) {
          this.ort = val[i];
          break;
        }
      }
    });
  }

  /**
   * diese Funktion dient dazu, Bewertungen abzugeben
   * sie ruft dafuer die Sendefunktion in data.service auf
   * ausserdem ueberprueft sie, ob das aktuelle Datum zeitlich
   * nach jenem der Veranstaltung liegt
   */
  async rateVeranstaltung() {
    const postData = {
      veranstaltung: this.id,
      bewertung: this.bewertungsnachricht,
      sterne: this.rate,
      status: 'publish',
      mac: this.device.uuid
    };
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.token)
    };
    this.dataService.doAddBewertung(postData, header).subscribe(data => {
    });
    const toast = await this.toastController.create({
      message: 'Ihre Bewertung wurde abgeschickt',
      duration: 2000
    });
    await toast.present();
    this.bewertenVerbieten = true;
  }

  /**
   * Loads eventtitel.
   */
  async loadSessionFeed() {
    // lade den eventtitel aus dem speicher und speichere ihn in der zu displayenden variable
    this.storage.get('eventTitel').then((val) => {
      this.sessionnamevar = val;
    });
  }

  /**
   * Opens PDF.
   */
  async openPDF(url) {
    this.browserTab.isAvailable().then(s => {
      if (s) {
        this.browserTab.openUrl(url);
      } else {
      }
    })
    .catch(error => {
      console.log('Error while opening lageplan (please try on a smartphone)=' + error);
    });
  }

  /**
   * kontrolliert Veraenderungen der Favouriten
   * kontrolliert Sterne beim schedule page
   */
  clickFavouriteButton() {
    this.dataService.setUnfav();
    this.storage.get(this.id.toString()).then((val) => {
      if (val === true) {
        this.dataService.favVeranstaltung.set(this.id, false);
        this.storage.set(this.id.toString(), false);
        this.fav = false;
      } else {
        this.storage.set(this.id.toString(), true);
        this.dataService.favVeranstaltung.set(this.id, true);
        this.fav = true;
      }
    });
  }

  /**
   * es wird ueberprueft, ob der Benutzer schon die Veranstaltung bewertet hat
   * und ob die Veranstaltung bereits in der Vergangenheit liegt
   */
  doCheckBewertung() {
    this.dataService.getData('bewertung').subscribe(data => {
      this.bewertung = data;
      let currRemoteDateDate = this.veranstaltung.ende_datum;
      let currRemoteDateTime = this.veranstaltung.ende_zeit;
      let currDate = new Date();
      let timeZoneModifier = 1; // gmt+x
      const currentDeviceTimeStamp =
        100 * 100 * parseInt(currDate.toISOString().substring(0, 4)) +
        100 * parseInt(currDate.toISOString().substring(5, 7)) +
        parseInt(currDate.toISOString().substring(8, 10)) +
        0.01 * (parseInt(currDate.toISOString().substring(11, 13)) + timeZoneModifier) +
        0.01 * 0.01 * parseInt(currDate.toISOString().substring(14, 16));
      const targetVeranstaltungTimeStamp =
        parseInt(currRemoteDateDate.substring(0, 2)) +
        100 * parseInt(currRemoteDateDate.substring(3, 5)) +
        100 * 100 * parseInt(currRemoteDateDate.substring(6, 10)) +
        0.01 * parseInt(currRemoteDateTime.substring(0, 2)) +
        0.01 * 0.01 * parseInt(currRemoteDateTime.substring(3, 5));

      if (currentDeviceTimeStamp < targetVeranstaltungTimeStamp) {
        this.bewertenVerbieten = true;
      }
      if (this.bewertung.find(be => {
        return be.mac === this.device.uuid && be.veranstaltung === this.id;
      })) {
        this.bewertenVerbieten = true;
      }
    });
  }
}
