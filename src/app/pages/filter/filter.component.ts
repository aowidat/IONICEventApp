import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})

export class FilterComponent {
  public formKatagorie = [
    { val: 'Vortrag', isChecked: false },
    { val: 'Seminar', isChecked: false },
    { val: 'Workshop', isChecked: false },
    { val: 'Ausstellung', isChecked: false },
    { val: 'Diskussion', isChecked: false },
    { val: 'Wettbewerb', isChecked: false },
    { val: 'Rahmenprogramm', isChecked: false },
    { val: 'Catering', isChecked: false },
    { val: 'Sonstiges', isChecked: false },
    { val: 'Führung', isChecked: false }
  ];

  kat = false;
  fav = false;
  datum = false;
  favIsChecked = false;
  favIsChecked2 = false;
  datumIsChecked = false;
  katIsChecked = false;
  kommAblaufVeranstaltungen = false;
  abgelaufeneIsChecked = false;
  kommendeIsChecked = false;
  filter: string[] = [];
  tag = '';
  monat = '';
  jahr = '';
  date = '';

  /**
   * Creates an instance of filter components
   *
   * @constructor
   * @param {PopoverController} popoverController Controller for Popovers.
   */
  constructor(private popoverController: PopoverController) { }

  /**
   * Filter wird durchgefuehrt
   */
  anwenden() {
    this.doCheckFilter();
    this.popoverController.dismiss(this.filter);
  }

  /**
   * Toggle Datum
   */
  doDatumIsChecked() {
    this.datumIsChecked = true;
    this.favIsChecked = false;
    this.favIsChecked2 = false;
    this.katIsChecked = false;
    this.kommAblaufVeranstaltungen = false;
    this.abgelaufeneIsChecked = false;
    this.kommendeIsChecked = false;
  }

  /**
   * Toggle Katagorien
   */
  doKatIsChecked() {
    this.datumIsChecked = false;
    this.favIsChecked = false;
    this.favIsChecked2 = false;
    this.katIsChecked = true;
    this.kommAblaufVeranstaltungen = false;
    this.abgelaufeneIsChecked = false;
    this.kommendeIsChecked = false;
  }

  /**
   * Toggle Favouriten
   */
  doFavIsChecked() {
    this.datumIsChecked = false;
    this.favIsChecked = true;
    this.katIsChecked = false;
    this.kommAblaufVeranstaltungen = false;
    this.abgelaufeneIsChecked = false;
    this.kommendeIsChecked = false;
  }

  /**
   * Toggle Favouriten
   */
  doAbgelaufeneIsChecked() {
    this.datumIsChecked = false;
    this.favIsChecked = false;
    this.katIsChecked = false;
    this.kommAblaufVeranstaltungen = true;
    this.abgelaufeneIsChecked = false;
    this.kommendeIsChecked = false;
  }

  /**
   * Toggle abgelaufene Veranstaltungen
   */
  toggleAbgelaufen() {
    this.kommendeIsChecked = false;
  }

  /**
   * Toggle kommende Veranstaltungen
   */
  toggleKommen() {
    this.abgelaufeneIsChecked = false;
  }

  /**
   * Ueberpruefung nach was gefiltert wird
   */
  doCheckFilter() {
    if (this.favIsChecked2) {
      this.filter.push('fav');
    }
    if (this.datumIsChecked) {
      this.filter.push('datum');
      if (this.tag.length === 1) {
        this.tag = '0' + this.tag;
      }
      if (this.monat.length === 1) {
        this.monat = '0' + this.monat;
      }
      this.date = this.tag + '.' + this.monat + '.' + this.jahr;
      this.filter.push(this.date);
    }
    if (this.katIsChecked) {
      this.filter.push('kat');
      for (const kat of this.formKatagorie) {
        if (kat.isChecked) {
          this.filter.push(kat.val.toLowerCase());
        }
      }
    }
    if (this.kommendeIsChecked) {
      this.filter.push('komm');
    }
    if (this.abgelaufeneIsChecked) {
      this.filter.push('ablauf');
    }
  }

  /**
   * schliessen
   */
  schliessen() {
    this.popoverController.dismiss('');
  }
}
