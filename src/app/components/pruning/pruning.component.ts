import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonCheckbox, IonInput, IonItem, IonLabel } from '@ionic/angular/standalone';
import { monthRange } from '../../shared/consts/monthRange';
import { PlantFormService } from '../../shared/services/plant-form.service';
import { RangeSliderComponent } from '../range-slider/range-slider.component';

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
