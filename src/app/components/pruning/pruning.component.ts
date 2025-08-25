import { Component, inject, OnInit } from '@angular/core';
import { IonLabel, IonCheckbox, IonInput, IonItem } from "@ionic/angular/standalone";
import { PlantFormService } from '@/services/plant-form.service';
import { CommonModule } from '@angular/common';
import { RangeSliderComponent } from "../range-slider/range-slider.component";
import { monthRange } from '@/consts/monthRange';

@Component({
  selector: 'app-pruning',
  templateUrl: './pruning.component.html',
  styleUrls: ['./pruning.component.scss'],
  imports: [IonLabel, IonCheckbox, CommonModule, IonInput, IonItem, RangeSliderComponent],
})
export class PruningComponent {

  plantFormService = inject(PlantFormService);
  plantForm$ = this.plantFormService.plantForm$;

  monthRange = monthRange;


}
