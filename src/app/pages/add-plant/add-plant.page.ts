import { distanceRange } from '@/consts/distanceRange';
import { monthRange } from '@/consts/monthRange';
import { requiredArea } from '@/consts/requiredArea';
import { CHECKBOX_FIELDS, CHECKBOX_LABELS } from '@/modals/plant-checkbox.config';
import { db } from '@/services/app-database.service';
import { CollectionStorageService } from '@/services/collection-storage.service';
import { PlantStorageService } from '@/services/plant-storage.service';
import { convertBlobToBase64 } from '@/utils/image.utils';
import { getFirstLetter } from '@/utils/string.utils';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import {
  AlertController,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';
import { FertilizationComponent } from 'src/app/components/fertilization/fertilization.component';
import { FruitComponent } from 'src/app/components/fruit/fruit.component';
import { ImagePickerComponent } from 'src/app/components/image-picker/image-picker.component';
import { LightSelectorComponent } from 'src/app/components/light-selector/light-selector.component';
import { PlantTypeComponent } from 'src/app/components/plant-type/plant-type.component';
import { PruningComponent } from 'src/app/components/pruning/pruning.component';
import { RangeSliderComponent } from 'src/app/components/range-slider/range-slider.component';
import { RootSystemComponent } from 'src/app/components/root-system/root-system.component';
import { SoilComponent } from 'src/app/components/soil/soil.component';
import { WaterSelectorComponent } from 'src/app/components/water-selector/water-selector.component';
import { PlantFormService } from 'src/app/shared/services/plant-form.service';
import { Plant } from 'src/app/shared/types/PlantType';

import { ColorChoicesComponent } from 'src/app/components/color-choices/color-choices.component';

@Component({
  selector: 'app-add-plant',
  templateUrl: './add-plant.page.html',
  styleUrls: ['./add-plant.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonInput,
    ImagePickerComponent,
    RangeSliderComponent,
    IonLabel,
    IonCheckbox,
    LightSelectorComponent,
    SoilComponent,
    FertilizationComponent,
    WaterSelectorComponent,
    PlantTypeComponent,
    PruningComponent,
    IonTextarea,
    FruitComponent,
    IonButton,
    IonModal,
    RootSystemComponent,
    ColorChoicesComponent,
  ],
})
export class AddPlantPage implements OnInit {
  plantFormService = inject(PlantFormService);
  plantStorageService = inject(PlantStorageService);
  collectionStorageService = inject(CollectionStorageService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  alertCtrl = inject(AlertController);
  plantForm$ = this.plantFormService.plantForm$;
  monthRange = monthRange;
  distanceRange = distanceRange;
  requiredArea = requiredArea;
  parentId: number | null = null;
  isEditMode = false;

  @ViewChild('dialog') modal!: IonModal;
  lastAddedPlantId: number | null = null;

  checkboxFields = CHECKBOX_FIELDS;

  checkboxLabels = CHECKBOX_LABELS;

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const parentId = params['parentId'];
      const editId = params['editId'];

      if (parentId) this.parentId = Number(parentId);

      if (editId) this.isEditMode = true;
    });
  }

  async savePlant() {
    const plant = this.plantFormService.getPlant();
    if (!this.parentId) plant.initialId = getFirstLetter(plant.nameLatin);
    else plant.collectionId = this.parentId;

    const errors = this.validatePlant(plant);
    if (errors.length > 0) {
      const alert = await this.alertCtrl.create({
        header: 'Fehler',
        message: errors.join('\n'),
        cssClass: 'custom-alert',
        buttons: ['OK'],
      });

      await alert.present();
      return;
    }

    try {
      if (this.isEditMode) {
        await this.updatePlant(plant);
      } else {
        await this.createPlant(plant);
      }

      await this.modal.present();
    } catch (error) {
      console.error('Failed to save plant:', error);
    }
  }

  private async createPlant(plant: Plant) {
    if (plant.imageUrl) {
      plant.imageUrl = await this.saveImageInStore(plant.imageUrl);
    }

    const id = await this.plantStorageService.addPlant(plant);

    if (this.parentId) {
      await this.collectionStorageService.addChild(this.parentId, id, 'plant');
    }

    this.lastAddedPlantId = id;
  }

  private async updatePlant(plant: Plant) {
    const existing = await this.plantStorageService.getPlant(plant.id!);

    if (plant.imageUrl && plant.imageUrl !== existing?.imageUrl) {
      plant.imageUrl = await this.saveImageInStore(plant.imageUrl);
    }

    await this.plantStorageService.updatePlant(plant.id!, plant);

    this.lastAddedPlantId = plant.id!;
  }

  saveAndAddAnother() {
    this.plantFormService.reset();
    this.lastAddedPlantId = null;
    this.modal.dismiss();
  }

  saveAndView() {
    this.plantFormService.reset();
    this.router.navigate(['/plant', this.lastAddedPlantId]);
    this.lastAddedPlantId = null;
    this.modal.dismiss();
  }

  private validatePlant(plant: Plant): string[] {
    const errors: string[] = [];

    if (!plant.nameLatin?.trim()) {
      errors.push('Der lateinische Name darf nicht leer sein.');
    }

    if (!plant.nameGerman?.trim()) {
      errors.push('Der deutsche Name darf nicht leer sein.');
    }

    if (plant.pruning.enabled) {
      if (!plant.pruning.time?.trim()) {
        errors.push('Zeit darf nicht leer sein, wenn Rückschnitt aktiviert ist.');
      }
      if (!plant.pruning.amount?.trim()) {
        errors.push('Menge darf nicht leer sein, wenn Rückschnitt aktiviert ist.');
      }
    }

    if (plant.fertilization.enabled) {
      if (!plant.fertilization.type?.trim()) {
        errors.push('Typ darf nicht leer sein, wenn Dünger aktiviert ist.');
      }
      if (!plant.fertilization.time?.trim()) {
        errors.push('Zeit darf nicht leer sein, wenn Dünger aktiviert ist.');
      }
    }

    return errors;
  }

  async saveImageInStore(imagePath: string) {
    if (Capacitor.getPlatform() === 'web') {
      const blob = await fetch(imagePath).then((r) => r.blob());
      const imageId = await db.images.add({
        name: Date.now().toString(),
        data: blob,
        updatedAt: new Date().toISOString(),
      });
      return String(imageId);
    } else {
      const fileName = `${Date.now()}.jpeg`;
      const folderName = 'PflanzenABC';
      const fullPath = `Pictures/${folderName}/${fileName}`;

      if (imagePath.startsWith('file://')) {
        await Filesystem.copy({
          from: imagePath,
          to: fullPath,
          directory: Directory.ExternalStorage,
        });
      } else {
        const blob = await fetch(imagePath).then((r) => r.blob());
        const base64 = (await convertBlobToBase64(blob)) as string;

        await Filesystem.writeFile({
          path: fullPath,
          data: base64.split(',')[1],
          directory: Directory.ExternalStorage,
          recursive: true,
        });
      }

      return fileName;
    }
  }

  ionViewWillLeave() {
    this.plantFormService.reset();
    this.destroy$.next();
  }
}
