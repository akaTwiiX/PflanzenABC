import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  NavController,
} from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';
import { AutumnColorsComponent } from '../../components/autumn-colors/autumn-colors.component';
import { ColorChoicesComponent } from '../../components/color-choices/color-choices.component';
import { DistanceComponent } from '../../components/distance/distance.component';
import { FertilizationComponent } from '../../components/fertilization/fertilization.component';
import { FruitComponent } from '../../components/fruit/fruit.component';
import { GrowthFormComponent } from '../../components/growth-form/growth-form.component';
import { ImagePickerComponent } from '../../components/image-picker/image-picker.component';
import { LeafShapeComponent } from '../../components/leaf-shape/leaf-shape.component';
import { LightSelectorComponent } from '../../components/light-selector/light-selector.component';
import { PlantTypeComponent } from '../../components/plant-type/plant-type.component';
import { PruningComponent } from '../../components/pruning/pruning.component';
import { RangeSliderComponent } from '../../components/range-slider/range-slider.component';
import { RequiredAreaComponent } from '../../components/required-area/required-area.component';
import { RootSystemComponent } from '../../components/root-system/root-system.component';
import { SoilComponent } from '../../components/soil/soil.component';
import { WaterSelectorComponent } from '../../components/water-selector/water-selector.component';
import { distanceRange, growthDistanceRange } from '../../shared/consts/distanceRange';
import { monthRange } from '../../shared/consts/monthRange';
import { requiredArea } from '../../shared/consts/requiredArea';
import { CHECKBOX_FIELDS, CHECKBOX_LABELS } from '../../shared/modals/plant-checkbox.config';
import { db } from '../../shared/services/app-database.service';
import { CollectionStorageService } from '../../shared/services/collection-storage.service';
import { PlantFormService } from '../../shared/services/plant-form.service';
import { PlantStorageService } from '../../shared/services/plant-storage.service';
import type { Plant } from '../../shared/types/PlantType';
import { convertBlobToBase64 } from '../../shared/utils/image.utils';
import { getFirstLetter } from '../../shared/utils/string.utils';

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
    RequiredAreaComponent,
    DistanceComponent,
    GrowthFormComponent,
    LeafShapeComponent,
    AutumnColorsComponent,
  ],
})
export class AddPlantPage {
  plantFormService = inject(PlantFormService);
  plantStorageService = inject(PlantStorageService);
  collectionStorageService = inject(CollectionStorageService);
  route = inject(ActivatedRoute);
  navCtrl = inject(NavController);
  alertCtrl = inject(AlertController);
  plantForm$ = this.plantFormService.plantForm$;
  monthRange = monthRange;
  distanceRange = distanceRange;
  requiredArea = requiredArea;
  growthRange = growthDistanceRange;
  parentId: number | null = null;
  isEditMode = false;

  @ViewChild('dialog') modal!: IonModal;
  @ViewChild(IonContent) content!: IonContent;
  lastAddedPlantId: number | null = null;

  checkboxFields = CHECKBOX_FIELDS;

  checkboxLabels = CHECKBOX_LABELS;

  private destroy$ = new Subject<void>();

  ionViewWillEnter() {
    this.content?.scrollToTop(0);
    this.lastAddedPlantId = null;
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(async (params) => {
      const { parentId, editId } = params as { parentId?: string, editId?: string, };

      this.parentId = parentId ? Number(parentId) : null;
      this.isEditMode = !!editId;

      if (this.isEditMode) {
        console.log('Edit mode activated for ID:', editId);
        const plant = await this.plantStorageService.getPlant(Number(editId));
        if (!plant)
          return;
        this.plantFormService.setPlant(plant);
      } else {
        this.plantFormService.reset();
      }

      console.log('editId', editId);
      console.log('parentId', parentId);
      console.log('isEditMode', this.isEditMode);
    });
  }

  async savePlant() {
    const plant = this.plantFormService.getPlant();
    if (!this.parentId)
      plant.initialId = getFirstLetter(plant.nameLatin);
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
    this.navCtrl.navigateForward(['/plant', this.lastAddedPlantId]);
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
      if (plant.fertilization.type?.length === 0) {
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
      const blob = await fetch(imagePath).then(r => r.blob());
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
        const blob = await fetch(imagePath).then(r => r.blob());
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
