import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonCheckbox, IonItem, IonLabel } from '@ionic/angular/standalone';
import { distanceRange } from '../../shared/consts/distanceRange';
import { PlantFormService } from '../../shared/services/plant-form.service';
import { RangeSliderComponent } from '../range-slider/range-slider.component';

@Component({
  selector: 'app-distance',
  standalone: true,
  templateUrl: './distance.component.html',
  imports: [CommonModule, IonCheckbox, IonItem, IonLabel, RangeSliderComponent],
  styleUrls: ['./distance.component.scss'],
})
export class DistanceComponent {
  plantFormService = inject(PlantFormService);
  plantForm$ = this.plantFormService.plantForm$;
  distanceRange = distanceRange;
}
