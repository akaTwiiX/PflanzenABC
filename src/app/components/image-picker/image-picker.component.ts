import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {  ActionSheetController} from '@ionic/angular';
import { IonButton, IonImg, IonText } from "@ionic/angular/standalone";

@Component({
  selector: 'app-image-picker',
  template: `
    <ion-button expand="block" (click)="presentImageSourceOptions()" class="container">
      @if(imageUrl){
        <ion-img [src]="imageUrl" style="width: 100%; height: 100%; border-radius: 8px;" ></ion-img>
      }
      @else {
        <ion-text color="medium">Bild hinzufügen</ion-text>
      }
    </ion-button>
  `,
  styleUrl:'image-picker.component.scss',
  imports: [ IonButton, IonImg, IonText],
})
export class ImagePickerComponent {
  imageUrl?: string;

  constructor(private actionSheetCtrl: ActionSheetController) { }

  async presentImageSourceOptions() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Bildquelle wählen',
      buttons: [
        {
          text: 'Kamera',
          icon: 'camera',
          handler: () => this.pickImage(CameraSource.Camera),
        },
        {
          text: 'Galerie',
          icon: 'image',
          handler: () => this.pickImage(CameraSource.Photos),
        },
        {
          text: 'Abbrechen',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  async pickImage(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source,
        correctOrientation:true
      });

      this.imageUrl = image.dataUrl ?? undefined;
    } catch (error) {
      console.error('Image pick failed:', error);
    }
  }
}
