import { async } from '@angular/core/testing';
import { PopoverController } from '@ionic/angular';
import { FilterComponent } from './filter.component';

describe('FilterComponent', () => {
  beforeEach(async(() => {
  }));
  it('should create filter', () => {
    var tmp = new FilterComponent(PopoverController.prototype);
  });
  it('should check filter', () => {
    var tmp = new FilterComponent(PopoverController.prototype);
    tmp.doCheckFilter();
  });
  it('should check datum', () => {
    var tmp = new FilterComponent(PopoverController.prototype);
    tmp.doDatumIsChecked();
  });
  it('should check favoriten', () => {
    var tmp = new FilterComponent(PopoverController.prototype);
    tmp.doFavIsChecked();
  });
  it('should check kategorie', () => {
    var tmp = new FilterComponent(PopoverController.prototype);
    tmp.doKatIsChecked();
  });
  it('should check abgelaufene', () => {
    var tmp = new FilterComponent(PopoverController.prototype);
    tmp.doAbgelaufeneIsChecked();
  });
});
