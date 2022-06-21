import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

describe('DataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should do bewertung', () => {
    var tmp = new DataService(HttpClient.prototype, null);
    const postData = {};
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ')
    };
    tmp.doAddBewertung(postData, header);
  });

  it('should get token', () => {
    var tmp = new DataService(HttpClient.prototype, null);
    tmp.getToken();
  });
  it('should get neewsfeed', () => {
    var tmp = new DataService(HttpClient.prototype, null);
    tmp.getData('news').subscribe(newsfeed => {
    });
  });
  it('should get allgemein', () => {
    var tmp = new DataService(HttpClient.prototype, null);
    tmp.getData('allgemein').subscribe(newsfeed => {
    });
  });
  it('should get users', () => {
    var tmp = new DataService(HttpClient.prototype, null);
    tmp.getData('users').subscribe(newsfeed => {
    });
  });
});
