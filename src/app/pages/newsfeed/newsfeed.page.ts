import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'newsfeed',
  templateUrl: './newsfeed.page.html',
  styleUrls: ['./newsfeed.page.scss']
})

/** @class NewsfeedPage Tab */
export class NewsfeedPage implements OnInit {
  newsFeed: any = [];
  newsfeednamevar: any = '';

  /**
   * Creates an instance of NewsfeedPage.
   *
   * @constructor
   * @param {DataService} dataService Service for HTTP requests and storage operations.
   * @param {Storage} storage Storage to save data offline.
   */
  constructor(private dataService: DataService, private storage: Storage) { }

  /**
   * Calls loading function after opening the tab.
   */
  ngOnInit() {
    this.loadNewsFeed();
  }

  /**
   * es werden alle NewsFeed aus dem API mittles DataService aufgerufen
   */
  async loadNewsFeed() {
    return new Promise(async(resolve, reject) => {
      await this.dataService.getData('news').subscribe(newsfeed => {
        this.newsFeed = newsfeed;
        resolve();
      });
      // lade den Eventtitel aus dem Speicher und speichere ihn in der zu displayenden variable
      this.storage.get('eventTitel').then((val) => {
        this.newsfeednamevar = val;
      });
    });
  }

  /**
   * die Funktion loadNewsFeed wird aufgerufen, wenn der Nutzer den Refresher nutzt
   * @param event vom Refresher
   */
  doRefreshNewsFeed(event) {
    this.loadNewsFeed().then((res) => {
      event.target.complete();
    });
  }
}
