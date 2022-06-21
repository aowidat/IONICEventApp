/* eslint-disable no-useless-constructor */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { MenuController, Platform, ToastController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { BrowserTab } from '@ionic-native/browser-tab/ngx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})

/** @class AppComponent for menu */
export class AppComponent implements OnInit {
  appPages = [
    {
      title: 'Schedule',
      url: '/app/tabs/schedule',
      icon: 'calendar'
    },
    {
      title: 'Speakers',
      url: '/app/tabs/speakers',
      icon: 'person'
    }
  ];

  dark = false;

  /**
   * Creates an instance of SchedulePage.
   *
   * @constructor
   * @param {ToastController} toastCtrl Toast controller to display subtle notifications.
   * @param {Storage} storage Storage to save data offline.
   * @param {StatusBar} statusBar Status bar to display status information.
   * @param {SplashScreen} splashScreen Splash screen to show during application launch.
   * @param {SwUpdate} swUpdate SwUpdate to use update notifications from service worker.
   * @param {AlertController} alertCtrl Alert controller to give alerts when errors occur.
   * @param {Platform} platform Platform to get info about the operating system.
   * @param {BrowserTab} browserTab Browser tab to open URLs in the app.
   * @param {Router} router Router to get paths to different tabs.
   * @param {MenuController} menu Menu controller to display objects on the menu.
   */
  constructor(
    private browserTab: BrowserTab,
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  /**
   * Creates AppComponent.
   */
  async ngOnInit() {
  }

  /**
   * Calls  function to clear the storage.
   */
  async clearStorage() {
    clearTheStorage(this);
  }
}

/**
 * Clears the offline storage.
 */
async function clearTheStorage(instance) {
  const alert = await instance.alertCtrl.create({
    header: 'Alle Offline-Daten löschen?',
    subHeader: 'Diese Aktion kann nicht rückgängig gemacht werden. (Empfehlung: nur vor Deinstallation der App tun)',
    buttons: [
      {
        text: 'ja',
        handler: () => {
          instance.storage.clear();
          confirmStorageCleared(instance);
        }
      },
      {
        text: 'nein',
        handler: () => {
        }
      }
    ]
  });
  alert.present();
}

/**
 * Confirms to the user that offline storage was cleared.
 */
async function confirmStorageCleared(instance) {
  const alert = await instance.alertCtrl.create({
    header: 'Offline-Daten wurden gelöscht',
    subHeader: 'Um neue Daten herunterzuladen, bitte refreshen',
    buttons: [{
      text: 'OK',
      handler: () => {
        instance.storage.get('deletingOffline').then((val) => {
          // rememebers to reload app WITHOUT loading data from API
          instance.storage.set('deletingOffline', true);
        });
        // reload app
        document.location.href = 'index.html';
      }
    }]
  });
  alert.present();
}
