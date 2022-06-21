import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Storage } from '@ionic/storage';
const apiUrl = environment.apiUrl;
const tokenURL = environment.tokenURL;

@Injectable({
  providedIn: 'root'
})

/** @class DataService */
export class DataService {
  veranstaltungen: any[] = [];
  public temp: any[] = [];
  favVeranstaltung: any = new Map();
  unfavourized_sth_filter_var: boolean = false;

  /**
   * Creates an instance of SchedulePage.
   *
   * @constructor
   * @param {HttpClient} http Client for HTTP requests.
   * @param {Storage} storage Storage to save data offline.
   */
  constructor(private http: HttpClient, private storage: Storage) {}

  /**
   * Post Request fuer Bewertung
   * @param data BewertungsData
   * @param httpOption Header vom Request
   */
  doAddBewertung(data, httpOption) {
    return this.http.post(`${apiUrl}/bewertung`, data, httpOption);
  }

  /**
   * Request token from API.
   */
  getToken() {
    const result = this.http.post(tokenURL, null).subscribe(data => {
      this.storage.get('token').then((val) => {
      // speichere token offline
        this.storage.set('token', data['token']);
      });
    },
    err => {
      console.log('Error: ' + JSON.stringify(err.error));
    });
  }

  /**
   * Request data from API.
   */
  getData(url: string) {
    return this.http.get(`${apiUrl}/${url}`);
  }

  /**
   * Setter for veranstaltungen.
   */
  setVeranstaltungen(veranstaltungen: any) {
    this.veranstaltungen = veranstaltungen;
  }

  /**
   * Getter for veranstaltungen.
   */
  getVeranstaltungen() {
    return this.veranstaltungen;
  }

  /**
   * Setter for filter reset on change favourite.
   */
  setUnfav() {
    this.unfavourized_sth_filter_var = true;
  }

  /**
   * Resetter for filter reset on change favourite.
   */
  resetUnfav() {
    this.unfavourized_sth_filter_var = false;
  }

  /**
   * Getter for filter reset on change favourite.
   */
  getUnfavVar() {
    return this.unfavourized_sth_filter_var;
  }
}
