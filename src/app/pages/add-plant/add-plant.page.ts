import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonList, IonItem, IonInput, IonLabel, IonCheckbox, IonTextarea, IonButton, IonModal } from '@ionic/angular/standalone';
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
  plantForm$ = this.plantFormService.plantForm$;
  monthRange = monthRange;
  distanceRange = distanceRange;
  parentId: number | null = null;

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
      if (parentId) {
        this.parentId = Number(parentId);
      }
    });
  }

  async savePlant() {
    const plant = this.plantFormService.getPlant();
    if (!this.parentId)
      plant.initialId = getFirstLetter(plant.nameLatin);

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

  ngOnDestroy(): void {
    this.plantFormService.reset();
  }

}
