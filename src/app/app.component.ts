import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SafeArea } from 'capacitor-plugin-safe-area';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      SafeArea.getSafeAreaInsets().then((data) => {
        const { insets } = data;
        document.body.style.setProperty('--ion-safe-area-top', `${insets.top}px`);
        document.body.style.setProperty('--ion-safe-area-right', `${insets.right}px`);
        document.body.style.setProperty('--ion-safe-area-bottom', `${insets.bottom}px`);
        document.body.style.setProperty('--ion-safe-area-left', `${insets.left}px`);
      });
    });
  }


}
