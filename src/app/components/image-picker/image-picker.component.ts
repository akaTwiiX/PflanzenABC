import { db } from '@/services/app-database.service';
import { loadNativeImage } from '@/utils/image.utils';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { IonIcon, IonImg, IonText, IonActionSheet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-image-picker',
  templateUrl: 'image-picker.component.html',
  styleUrl: 'image-picker.component.scss',
  imports: [IonIcon, IonImg, IonText, IonActionSheet],
})
export class ImagePickerComponent implements OnChanges {
  @Input() value!: string | undefined;
  @Output() valueChange = new EventEmitter<string>();
  image: string | undefined = undefined;

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['value'] && this.value) {
      const type = this.detectType(this.value);
      console.log('Image value changed:', this.value, '→', type);

      switch (type) {
        case 'index':
          const entry = await db.images.get(Number(this.value));
          this.image = entry ? URL.createObjectURL(entry.data) : undefined;
          break;
        case 'filesystem':
          const image = await loadNativeImage(this.value);
          this.image = image;
          break;
        case 'temporary':
          this.image = this.value;
          break;
      }
    }
  }

  private detectType(val: string): 'index' | 'filesystem' | 'temporary' {
    if (/^\d+$/.test(val)) {
      return 'index';
    }
    if (/^[^/]+?\.(jpe?g|png|gif)$/i.test(val)) {
      return 'filesystem';
    }
    return 'temporary';
  }

  constructor() {}

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
    if (Capacitor.getPlatform() !== 'web') {
      await Camera.requestPermissions({ permissions: ['camera', 'photos'] });
    }

    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source,
      });

      this.value = photo.webPath!;
      this.valueChange.emit(this.value);
    } catch (error) {
      console.error('Image pick failed:', error);
    }
  }

  deleteImage(event: Event) {
    event.stopPropagation();
    this.valueChange.emit('');
  }
}
