import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app-module';
import { register } from 'swiper/element/bundle';
register();
platformBrowser().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));

