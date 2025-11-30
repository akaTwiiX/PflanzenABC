import { db } from '@/services/app-database.service';
import { loadNativeImage } from '@/utils/image.utils';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { IonActionSheet, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonImg, IonModal, IonText, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-picker',
  templateUrl: 'image-picker.component.html',
  styleUrl: 'image-picker.component.scss',
  imports: [
    IonIcon,
    IonImg,
    IonText,
    IonActionSheet,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonFooter,
    ImageCropperComponent,
  ],
})
export class ImagePickerComponent implements OnChanges {
  @Input() value!: string | undefined;
  @Output() valueChange = new EventEmitter<string>();
  image: string | undefined = undefined;

  @ViewChild('cropModal') cropModal!: IonModal;

  isCropModalOpen = false;
  croppingImage: File | null = null;
  croppedImage: string | null = null;

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
      if (photo.webPath) {
        const response = await fetch(photo.webPath);
        const blob = await response.blob();
        this.croppingImage = new File([blob], 'image.jpg', { type: 'image/jpeg' });
        this.cropModal.present();
      }
    } catch (error) {
      console.error('Image pick failed:', error);
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event.objectUrl) {
      this.croppedImage = event.objectUrl;
    }
  }

  confirmCrop() {
    if (this.croppedImage) {
      this.value = this.croppedImage;
      this.valueChange.emit(this.value);
      this.cropModal.dismiss();
      this.croppingImage = null;
      this.croppedImage = null;
    }
  }

  cancelCrop() {
    this.cropModal.dismiss();
    this.croppingImage = null;
    this.croppedImage = null;
  }

  deleteImage(event: Event) {
    event.stopPropagation();
    this.valueChange.emit('');
  }
}
