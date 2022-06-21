/* eslint-disable no-useless-constructor */
/* eslint-disable camelcase */
import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../data.service';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  styleUrls: ['./about.scss']
})

/** @class AboutPage for Tab for allgemeine Eventinfos */
export class AboutPage implements OnInit {
  logo: any = '';
  aboutnamevar: any = '';
  about_text_minus: any = '-';
  about_eventbegindate: any = '';
  about_eventenddate: any = '';
  about_website_info: any = '';
  about_location_name: any = '';
  about_location_street: any = '';
  about_location_postcode: any = '';
  about_location_city: any = '';
  about_arrival_car_intro: any = 'Anfahrt Pkw:';
  about_arrival_car: any = '';
  about_arrival_train_intro: any = 'Anfahrt Zug:';
  about_arrival_train: any = '';
  about_arrival_airplane_intro: any = 'Anfahrt Flugzeug:';
  about_arrival_airplane: any = '';
  about_organizer_name: any = '';
  about_organizer_email: any = '';
  about_organizer_phone: any = '';
  about_desc: any = '';

  /**
   * Creates an instance of AboutPage.
   *
   *
   * @constructor
   * @param {PopoverController} popoverCtrl Controller for Popovers.
   * @param {DataService} dataService Service for HTTP requests and storage operations.
   * @param {Storage} storage Storage to save data offline.
   */
  constructor(public popoverCtrl: PopoverController, private dataService: DataService, private storage: Storage) { }

  /**
   * Calls loading function after opening the tab.
   */
  ngOnInit() {
    this.loadAboutInfos();
  }

  /**
   * Calls loading function when opening the tab.
   */
  ionViewWillEnter() {
    this.loadAboutInfos();
  }

  /**
   * Loads about data from the API or the storage.
   */
  async loadAboutInfos() {
    // lade den eventtitel aus dem speicher und speichere ihn in der zu displayenden variable
    this.storage.get('eventTitel').then((val) => {
      this.aboutnamevar = val;
    });
    // lade den Starttermin des Events aus der api und speichere ihn in der zu displayenden variable
    await this.storage.get('allgemeinStorage').then((about) => {
      let z = 0;
      let zmax = 0;
      if (about != null) {
        zmax = about.length;
      }
      let z_num_eventinformationen;
      let z_num_eventlocation;
      let z_num_organisation;
      while (z < zmax) {
        if (about[z].slug === 'eventinformationen') {
          z_num_eventinformationen = z;
        } else if (about[z].slug === 'eventlocation') {
          z_num_eventlocation = z;
        } else if (about[z].slug === 'organisation') {
          z_num_organisation = z;
        }
        z++;
      }
      try {
        this.logo = about[z_num_eventinformationen].logo.url;
        this.about_eventbegindate = about[z_num_eventinformationen].beginn;
        this.about_eventenddate = about[z_num_eventinformationen].ende;
        this.about_website_info = about[z_num_eventlocation].webseite;
        this.about_location_name = about[z_num_eventlocation].name;
        this.about_location_street = about[z_num_eventlocation].strasse;
        this.about_location_postcode = about[z_num_eventlocation].plz;
        this.about_location_city = about[z_num_eventlocation].ort;
        this.about_arrival_car = about[z_num_eventlocation].anfahrtshinweise_pkw;
        this.about_arrival_train = about[z_num_eventlocation].anfahrtshinweise_zug;
        this.about_arrival_airplane = about[z_num_eventlocation].anfahrtshinweise_flugzeug;
        this.about_organizer_name = about[z_num_organisation].verantwortlicher_name;
        this.about_organizer_email = about[z_num_organisation].verantwortlicher_email;
        this.about_organizer_phone = about[z_num_organisation].verantwortlicher_telefon;
        this.about_desc = about[z_num_eventinformationen].beschreibung;
      } catch (e) {
      }
    });
  }
}
