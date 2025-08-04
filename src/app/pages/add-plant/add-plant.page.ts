import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonList, IonItem, IonInput, IonLabel, IonCheckbox } from '@ionic/angular/standalone';
import { Plant } from 'src/app/shared/types/PlantType';
import { PlantFormService } from 'src/app/shared/services/plant-form.service';
import { ImagePickerComponent } from "src/app/components/image-picker/image-picker.component";
import { monthRange } from '@/consts/monthRange';
import { RangeSliderComponent } from "src/app/components/range-slider/range-slider.component";
import { distanceRange } from '@/consts/distanceRange';
import { LightSelectorComponent } from "src/app/components/light-selector/light-selector.component";

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
    LightSelectorComponent
  ],
})
export class AddPlantPage implements OnInit {
  plantFormService = inject(PlantFormService);
  plantForm$ = this.plantFormService.plantForm$;
  monthRange = monthRange;
  distanceRange = distanceRange;

  checkboxFields: (keyof Plant)[] = [
    'frostResistant',
    'fruit',
    'leaf',
    'dryTolerance',
    'edible',
    'toxic',
    'fragrant',
    'buckets'
  ];


  checkboxLabels: Partial<Record<keyof Plant, string>> = {
    frostResistant: 'Frosthart',
    fruit: 'Frucht',
    leaf: 'Blätter',
    dryTolerance: 'Trockenresistent',
    edible: 'Essbar',
    toxic: 'Giftig',
    fragrant: 'Duftend',
    buckets: 'Topfgeeignet'
  };



  ngOnInit() { }

  updateField<K extends keyof Plant>(key: K, value: Plant[K]) {
    this.plantFormService.setValue(key, value);
  }
}
