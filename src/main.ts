import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { addIcons } from 'ionicons';
import { chevronDown, add, camera, close, image, addCircleOutline, fileTrayFullOutline, pencilOutline } from 'ionicons/icons';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

addIcons({
  'add-circle-outline': addCircleOutline,
  'chevron-down': chevronDown,
  'add': add,
  'camera': camera,
  'close': close,
  'image': image,
  'file-tray-full-outline': fileTrayFullOutline,
  'pencil-outline': pencilOutline
});

defineCustomElements(window);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
