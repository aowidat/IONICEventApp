/* eslint-disable no-useless-constructor */
/* eslint-disable no-unused-vars */
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, PopoverController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network/ngx';
import { DataService } from '../../data.service';
import { HttpClient } from '@angular/common/http';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
  styleUrls: ['./schedule.scss']
})

/** @class SchedulePage Tab */
export class SchedulePage implements OnInit {
  veranstaltungen: any = [];
  textSuche = null;
  schedulenamevar: any = '';
  tag: any = [];
  restButton = false;

  /**
   * Creates an instance of SchedulePage.
   *
   * @constructor
   * @param {HttpClient} http Client for HTTP requests.
   * @param {DataService} dataService Service for HTTP requests and storage operations.
   * @param {LoadingController} loadingController Loading controller to display loading status.
   * @param {Storage} storage Storage to save data offline.
   * @param {Network} network Network to get info about the internet connection.
   * @param {AlertController} alertCtrl Alert controller to give alerts when errors occur.
   * @param {Platform} platform Platform to get info about the operating system.
   * @param {PopoverController} popoverController Controller for Popovers.
   */
  constructor(private popoverController: PopoverController, private http: HttpClient, private dataService: DataService, private loadingController: LoadingController,
              private storage: Storage, private network: Network, private alertCtrl: AlertController, private platform: Platform
  ) {}

  /**
   * Calls loading function and request token after opening the tab.
   */
  ngOnInit() {
    this.dataService.getToken();
    this.loadVeranstaltung();
  }

  /**
   * Calls function to get favorites when opening the tab.
   */
  ionViewWillEnter() {
    if (this.dataService.getUnfavVar()) {
      this.doResetFilter();
    }
    this.getFavVeranstaltung();
  }

  /**
   * Loads data for veranstaltungen from API or storage.
   */
  async loadVeranstaltung() {
    return new Promise((resolve, reject) => {
      // pruefe, ob gerade der offline storage geloescht wurde
      this.storage.get('deletingOffline').then(async(val) => {
        // falls nein, lade Veranstaltungen
        if (val === false) {
          const loading = await this.loadingController.create({
            message: 'Event wird heruntergeladen'
          });
          let hasloaded: Boolean;
          hasloaded = false;
          loading.present();
          // warte: time out von 10 sekunden
          setTimeout(async() => {
            // falls danach nicht von API geladen werden konnte, wird offline storage verwendet
            if (!hasloaded) {
              this.storage.get('veranstaltungStorage').then((val) => {
                this.veranstaltungen = val;
              });
              loading.dismiss();
              resolve();
              const alert = await this.alertCtrl.create({
                header: 'Langsame oder gar keine Internetverbindung',
                subHeader: 'Offline-Daten werden genutzt',
                buttons: ['OK']
              }
              );
              alert.present();
            }
          }, 10000);
          let anzahlGeladen = 0;
          // lade den Eventtitel aus der Api und speichere ihn in der zu displayenden Variable
          await this.dataService.getData('allgemein').subscribe(x => {
            let z = 0;
            while (x[z] !== undefined) {
              if (x[z].slug === 'eventinformationen') {
                this.schedulenamevar = x[z].name;
              }
              z++;
            }
            this.storage.get('eventTitel').then((val) => {
              // speichere Titel offline
              this.storage.set('eventTitel', this.schedulenamevar);
            });
            anzahlGeladen++;
            if (anzahlGeladen >= 5) {
              hasloaded = true;
              loading.dismiss();
              resolve();
            }
          });
          // versuche allgemein Informationen aus API zu laden
          await this.dataService.getData('allgemein').subscribe(ver => {
            this.storage.get('allgemeinStorage').then((val) => {
              // save veranstalter offline
              this.storage.set('allgemeinStorage', ver);
            });
            anzahlGeladen++;
            if (anzahlGeladen >= 5) {
              hasloaded = true;
              loading.dismiss();
              resolve();
            }
          });
          // versuche, Aussteller aus API zu laden
          this.dataService.getData('users').subscribe(ver => {
            this.storage.get('veranstalterStorage').then((val) => {
              // save veranstalter offline
              this.storage.set('veranstalterStorage', ver);
            });
            anzahlGeladen++;
            if (anzahlGeladen >= 5) {
              hasloaded = true;
              loading.dismiss();
              resolve();
            }
          });
          // versuche, Veranstaltungen von API zu laden
          this.dataService.getData('veranstaltungen').subscribe(veranstaltung => {
            this.veranstaltungen = veranstaltung;
            // Sort die Veranstaltung nach Datum und Zeit Beginn
            this.veranstaltungen = this.veranstaltungen.sort((a, b) => {
              if (a.beginn_datum.split('.').reverse().join('') > b.beginn_datum.split('.').reverse().join('')) {
                return 1;
              } else if (a.beginn_datum.split('.').reverse().join('') < b.beginn_datum.split('.').reverse().join('')) {
                return -1;
              } else {
                if (a.beginn_zeit > b.beginn_zeit) {
                  return 1;
                } else if (a.beginn_zeit < b.beginn_zeit) {
                  return -1;
                }
              }
            });
            this.getFavVeranstaltung();
            this.dataService.setVeranstaltungen(this.veranstaltungen);
            this.storage.get('veranstaltungStorage').then((val) => {
              // speichere veranstaltungen offline
              this.storage.set('veranstaltungStorage', this.veranstaltungen);
            });
            anzahlGeladen++;
            if (anzahlGeladen >= 5) {
              hasloaded = true;
              loading.dismiss();
              resolve();
            }
          });
          // versuche, Orte von API zu laden
          this.dataService.getData('orte').subscribe(orte => {
            this.storage.get('orteStorage').then((val) => {
              // speichere veranstaltungen offline
              this.storage.set('orteStorage', orte);
            });
            anzahlGeladen++;
            if (anzahlGeladen >= 5) {
              hasloaded = true;
              loading.dismiss();
              resolve();
            }
          });
        }
        // tslint:disable-next-line:max-line-length
        // falls die Seite nach Loeschung vom storage geladen wurde, wird nun gespeichert, dass bei weiteren reloads wieder die API abgefragt wird
        this.storage.set('deletingOffline', false);
      });
    });
  }

  /**
   * hier wird die Funktion loadVeranstaltung aufgeruft, wenn der Nutzer den Refresher nutzt
   * @param event vom Refresher
   */
  doRefresh(event) {
    this.loadVeranstaltung().then((res) => {
      event.target.complete();
    });
    this.restButton = false;
  }

  /**
   * laedt alle Veranstaltungen aus dem DataService
   */
  getVeranstlatung() {
    this.veranstaltungen = this.dataService.getVeranstaltungen();
  }

  /**
   * es wird nach Titel der Veranstaltung gesucht
   * dafuer wird das Attribut textsuche durch den Nutzer nach jedem Buchstaben geaendert
   */
  doSearch() {
    if (this.restButton) {
      this.veranstaltungen = this.veranstaltungen.filter((veranstaltung: { titel: string; }) => {
        return veranstaltung.titel.toLowerCase().indexOf(this.textSuche.toLowerCase()) > -1;
      });
    } else {
      this.veranstaltungen = this.dataService.getVeranstaltungen();
      this.veranstaltungen = this.veranstaltungen.filter((veranstaltung: { titel: string; }) => {
        return veranstaltung.titel.toLowerCase().indexOf(this.textSuche.toLowerCase()) > -1;
      });
    }
  }

  /**
   * laedt alle favourisierten Veranstaltungen aus dem Speicher
   */
  getFavVeranstaltung() {
    for (const ver of this.veranstaltungen) {
      this.storage.get(ver.id.toString()).then(value => {
        if (value === true) {
          this.dataService.favVeranstaltung.set(ver.id, true);
        } else {
          this.dataService.favVeranstaltung.set(ver.id, false);
        }
      });
    }
  }

  /**
   * ueberprueft ob eine Veranstaltung favourisiert ist
   * @param id der Veranstaltung
   */
  doCheckFavVeranstaltung(id: any) {
    if (this.dataService.favVeranstaltung.get(id)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Filter Funktion nach Datum ODER Favouriten ODER Kategorien
   */
  async doFilter() {
    const popover = await this.popoverController.create({
      component: FilterComponent,
      event: event,
      translucent: true,
      backdropDismiss: false
    });
    popover.onDidDismiss().then(data => {
      if (data !== '') {
        if (data.data.length !== 0) {
          if (data.data[0] === 'fav') {
            this.veranstaltungen = this.veranstaltungen.filter(veranstaltung => {
              return this.dataService.favVeranstaltung.get(veranstaltung.id) === true;
            });
            this.restButton = true;
          }
          if (data.data[0] === 'datum') {
            this.veranstaltungen = this.veranstaltungen.filter(veranstaltung => {
              return veranstaltung.beginn_datum === data.data[1];
            });
            this.restButton = true;
          }
          if (data.data[0] === 'kat') {
            this.veranstaltungen = this.dataService.getVeranstaltungen();
            this.veranstaltungen = this.veranstaltungen.filter((veranstaltung) => {
              try {
                return data.data.includes(veranstaltung.kategorie.toLowerCase());
              } catch (e) {
              }
            });
            this.restButton = true;
          }
          if (data.data[0] === 'komm') {
            const date = new Date();
            let dateNow: string =
              date.toISOString().substring(0, 4) +
              date.toISOString().substring(5, 7) +
              date.toISOString().substring(8, 10);
            let timeNow: string =
              date.toISOString().substring(11, 13) +
              date.toISOString().substring(14, 16);
            let timeZoneModifier = 1; // gmt+x
            let timeInt: any = parseInt(timeNow) + 100 * timeZoneModifier;
            timeNow = timeInt.toString();
            this.veranstaltungen = this.veranstaltungen.filter(ver => {
              // tslint:disable-next-line:max-line-length
              if (ver.beginn_datum.split('.').reverse().join('') > dateNow) {
                return ver;
                // tslint:disable-next-line:max-line-length
              } else if (ver.beginn_datum.split('.').reverse().join('') === dateNow) {
                if (ver.beginn_zeit.split(':').join('') > timeNow) {
                  return ver;
                }
              }
            });
            this.restButton = true;
          }
          if (data.data[0] === 'ablauf') {
            const date = new Date();
            let dateNow: string =
              date.toISOString().substring(0, 4) +
              date.toISOString().substring(5, 7) +
              date.toISOString().substring(8, 10);
            let timeNow: string =
              date.toISOString().substring(11, 13) +
              date.toISOString().substring(14, 16);
            let timeZoneModifier = 1; // gmt+x
            let timeInt: any = parseInt(timeNow) + 100 * timeZoneModifier;
            timeNow = timeInt.toString();
            this.veranstaltungen = this.veranstaltungen.filter(ver => {
              // tslint:disable-next-line:max-line-length
              if (ver.ende_datum.split('.').reverse().join('') < dateNow) {
                return ver;
                // tslint:disable-next-line:max-line-length
              } else if (ver.ende_datum.split('.').reverse().join('') === dateNow) {
                if (ver.ende_zeit.split(':').join('') <= timeNow) {
                  return ver;
                }
              }
            });
            this.restButton = true;
          }
        } else {
          this.popoverController.dismiss();
        }
      } else {
        this.popoverController.dismiss();
      }
    });
    return await popover.present();
  }

  /**
   * Rest Funktion nach der Nutzung vom Filter
   */
  doResetFilter() {
    this.restButton = false;
    this.veranstaltungen = this.dataService.getVeranstaltungen();
    this.dataService.resetUnfav();
    this.textSuche = '';
  }

  /**
   * wird ueberprueft, ob die Veranstaltung schon in der Vergangenheit liegt
   * @param datum Enddatum der Veranstaltung
   * @param zeit Endzeit der Veranstaltung
   */
  doCheckVeranstaltungZeit(datum, zeit) {
    const date = new Date();
    let dateNow: string =
      date.toISOString().substring(0, 4) +
      date.toISOString().substring(5, 7) +
      date.toISOString().substring(8, 10);
    let timeNow: string =
      date.toISOString().substring(11, 13) +
      date.toISOString().substring(14, 16);
    let timeZoneModifier = 1; // gmt+x
    let timeInt: any = parseInt(timeNow) + 100 * timeZoneModifier;
    timeNow = timeInt.toString();
    if (datum.split('.').reverse().join('') > dateNow) {
      return true;
    } else if (datum.split('.').reverse().join('') === dateNow) {
      if (zeit.split(':').join('') > timeNow) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
