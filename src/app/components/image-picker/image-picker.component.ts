import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonButton, IonImg, IonText, IonActionSheet } from "@ionic/angular/standalone";

@Component({
  selector: 'app-image-picker',
  templateUrl: 'image-picker.component.html',
  styleUrl: 'image-picker.component.scss',
  imports: [IonButton, IonImg, IonText, IonActionSheet],
})
export class ImagePickerComponent {
  @Input() value!: string | undefined;
  @Output() valueChange = new EventEmitter<string>();

  constructor() {

  }

  public actionSheetButtons = [
    {
      text: 'Kamera',
      icon: 'camera',
      role: 'camera',
      handler: () => this.pickImage(CameraSource.Camera),
      data: {
        action: 'camera',
      },
    },
    {
      text: 'Galerie',
      icon: 'image',
      role: 'gallery',
      handler: () => this.pickImage(CameraSource.Photos),
      data: {
        action: 'gallery',
      },
    },
    {
      text: 'Abbrechen',
      icon: 'close',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  async pickImage(source: CameraSource) {
    await Camera.requestPermissions({ permissions: ['camera', 'photos'] });

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source,
      });

      this.value = image.webPath ?? undefined;
      this.valueChange.emit(this.value)
    } catch (error) {
      console.error('Image pick failed:', error);
    }
  }
}
