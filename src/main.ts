import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { addIcons } from 'ionicons';
import {
  chevronDown,
  add,
  camera,
  close,
  image,
  addCircleOutline,
  fileTrayFullOutline,
  pencilOutline,
  arrowBackOutline,
  ellipsisVertical,
  trashOutline,
  closeCircle,
  checkmarkCircle,
  personCircleOutline,
  logOutOutline,
  cloudUploadOutline,
  logInOutline,
  bookOutline,
  leafOutline,
  settingsOutline,
  filterOutline,
} from 'ionicons/icons';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

addIcons({
  'add-circle-outline': addCircleOutline,
  'chevron-down': chevronDown,
  add: add,
  camera: camera,
  close: close,
  image: image,
  'file-tray-full-outline': fileTrayFullOutline,
  'pencil-outline': pencilOutline,
  'arrow-back-outline': arrowBackOutline,
  'ellipsis-vertical': ellipsisVertical,
  'trash-outline': trashOutline,
  'close-circle': closeCircle,
  'checkmark-circle': checkmarkCircle,
  'person-circle-outline': personCircleOutline,
  'log-out-outline': logOutOutline,
  'cloud-upload-outline': cloudUploadOutline,
  'log-in-outline': logInOutline,
  'book-outline': bookOutline,
  'leaf-outline': leafOutline,
  'settings-outline': settingsOutline,
  'filter-outline': filterOutline,
});

defineCustomElements();

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
