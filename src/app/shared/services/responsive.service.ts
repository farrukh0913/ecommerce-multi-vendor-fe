import { Injectable, NgZone, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ResponsiveService {
  private mobileQuery = window.matchMedia('(max-width: 575.98px)');
  private _isMobile = signal<boolean>(this.mobileQuery.matches);

  readonly isMobile = this._isMobile.asReadonly();

  constructor(private zone: NgZone) {
    this.mobileQuery.addEventListener('change', (e) => {
      console.log('change: ', e.matches);
      this.zone.run(() => {
        this._isMobile.set(e.matches);
      });
    });
  }
}
