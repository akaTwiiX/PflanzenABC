import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonCheckbox, IonItem, IonLabel } from '@ionic/angular/standalone';
import { monthRange } from '../../shared/consts/monthRange';
import { ChoiceName } from '../../shared/enums/ChoiceEntry';
import { ChoicesStorageService } from '../../shared/services/choices-storage.service';
import { PlantFormService } from '../../shared/services/plant-form.service';
import { ChoicesComponent } from '../choices/choices.component';
import { RangeSliderComponent } from '../range-slider/range-slider.component';

@Component({
  selector: 'app-fertilization',
  templateUrl: './fertilization.component.html',
  styleUrls: ['./fertilization.component.scss'],
  imports: [IonLabel, ChoicesComponent, CommonModule, IonCheckbox, IonItem, RangeSliderComponent],
})
export class FertilizationComponent {
  plantFormService = inject(PlantFormService);
  plantForm$ = this.plantFormService.plantForm$;
  choiceStorageService = inject(ChoicesStorageService);
  ChoiceName = ChoiceName;
  monthRange = monthRange;

  constructor() {}
}
