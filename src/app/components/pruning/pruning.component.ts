import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  IonCheckbox,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { monthRange } from '../../shared/consts/monthRange';
import { PlantFormService } from '../../shared/services/plant-form.service';

@Component({
  selector: 'app-pruning',
  templateUrl: './pruning.component.html',
  styleUrls: ['./pruning.component.scss', '../choices/choices.component.scss'],
  imports: [IonLabel, IonCheckbox, CommonModule, IonInput, IonItem, IonSelectOption, IonSelect],
})
export class PruningComponent {
  plantFormService = inject(PlantFormService);
  plantForm$ = this.plantFormService.plantForm$;

  monthRange = monthRange;
}
