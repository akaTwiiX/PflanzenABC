import { distanceRange } from '@/consts/distanceRange';
import { PlantFormService } from '@/services/plant-form.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonCheckbox, IonItem, IonLabel } from "@ionic/angular/standalone";
import { RangeSliderComponent } from "../range-slider/range-slider.component";

@Component({
  selector: 'app-distance',
  templateUrl: './distance.component.html',
  imports: [RangeSliderComponent, IonCheckbox, IonItem, IonLabel, CommonModule],
  styleUrls: ['./distance.component.scss'],
})
export class DistanceComponent {
  plantFormService = inject(PlantFormService);
  plantForm$ = this.plantFormService.plantForm$;
  distanceRange = distanceRange;

}
