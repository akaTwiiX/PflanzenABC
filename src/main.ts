import { bootstrapApplication } from '@angular/platform-browser';
import {
  PreloadAllModules,
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
} from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { addIcons } from 'ionicons';
import {
  add,
  addCircleOutline,
  arrowBack,
  arrowBackOutline,
  bookOutline,
  camera,
  checkmarkCircle,
  chevronDown,
  close,
  closeCircle,
  cloudUploadOutline,
  ellipsisVertical,
  fileTrayFullOutline,
  fileTrayStackedOutline,
  filterOutline,
  folderOpenOutline,
  folderOutline,
  image,
  imageOutline,
  leafOutline,
  logInOutline,
  logOutOutline,
  pencilOutline,
  personCircleOutline,
  settingsOutline,
  trashOutline,
} from 'ionicons/icons';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

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
  'file-tray-stacked-outline': fileTrayStackedOutline,
  'folder-open-outline': folderOpenOutline,
  'arrow-back': arrowBack,
  'image-outline': imageOutline,
  'folder-outline': folderOutline,
});

defineCustomElements();

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({
      swipeBackEnabled: true,
      backButtonDefaultHref: '/home',
    }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
