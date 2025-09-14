import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonList, IonItem, IonInput, IonLabel, IonCheckbox, IonTextarea, IonButton, IonModal, AlertController } from '@ionic/angular/standalone';
import { Plant } from 'src/app/shared/types/PlantType';
import { PlantFormService } from 'src/app/shared/services/plant-form.service';
import { ImagePickerComponent } from "src/app/components/image-picker/image-picker.component";
import { monthRange } from '@/consts/monthRange';
import { RangeSliderComponent } from "src/app/components/range-slider/range-slider.component";
import { distanceRange } from '@/consts/distanceRange';
import { LightSelectorComponent } from "src/app/components/light-selector/light-selector.component";
import { SoilComponent } from "src/app/components/soil/soil.component";
import { FertilizationComponent } from "src/app/components/fertilization/fertilization.component";
import { WaterSelectorComponent } from "src/app/components/water-selector/water-selector.component";
import { PlantTypeComponent } from "src/app/components/plant-type/plant-type.component";
import { PruningComponent } from "src/app/components/pruning/pruning.component";
import { FruitComponent } from "src/app/components/fruit/fruit.component";
import { PlantStorageService } from '@/services/plant-storage.service';
import { getFirstLetter } from '@/utils/string.utils';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionStorageService } from '@/services/collection-storage.service';

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
    IonModal
  ],
})
export class AddPlantPage implements OnInit, OnDestroy {
  plantFormService = inject(PlantFormService);
  plantStorageService = inject(PlantStorageService);
  collectionStorageService = inject(CollectionStorageService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  alertCtrl = inject(AlertController);
  plantForm$ = this.plantFormService.plantForm$;
  monthRange = monthRange;
  distanceRange = distanceRange;
  parentId: number | null = null;
  isEditMode = false;

  @ViewChild('dialog') modal!: IonModal;
  lastAddedPlantId: number | null = null;

  checkboxFields: (keyof Plant)[] = [
    'frostResistant',
    'leaf',
    'dryTolerance',
    'edible',
    'toxic',
    'fragrant',
    'buckets'
  ];


  checkboxLabels: Partial<Record<keyof Plant, string>> = {
    frostResistant: 'Frosthart',
    leaf: 'Blätter',
    dryTolerance: 'Trockenresistent',
    edible: 'Essbar',
    toxic: 'Giftig',
    fragrant: 'Duftend',
    buckets: 'Topfgeeignet'
  };



  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const parentId = params['parentId'];
      const editId = params['editId'];

      if (parentId)
        this.parentId = Number(parentId);

      if (editId)
        this.isEditMode = true;

    });
  }

  async savePlant() {
    const plant = this.plantFormService.getPlant();
    if (!this.parentId)
      plant.initialId = getFirstLetter(plant.nameLatin);

    const errors = this.validatePlant(plant);
    if (errors.length > 0) {
      const alert = await this.alertCtrl.create({
        header: 'Fehler',
        message: errors.join('\n'),
        cssClass: 'custom-alert',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }

    try {
      const id = await this.plantStorageService.addPlant(plant);
      if (this.parentId)
        await this.collectionStorageService.addChild(this.parentId, id, 'plant');

      this.lastAddedPlantId = id;

      await this.modal.present();
    } catch (error) {
      console.error('Failed to add new plant:', error);
    }

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


  ngOnDestroy(): void {
    this.plantFormService.reset();
  }

}
