import { Component, inject } from '@angular/core';
import { IonLabel, IonCheckbox, IonInput, IonItem } from "@ionic/angular/standalone";
import { PlantFormService } from '@/services/plant-form.service';
import { CommonModule } from '@angular/common';
import { monthRange } from '@/consts/monthRange';

@Component({
  selector: 'app-pruning',
  templateUrl: './pruning.component.html',
  styleUrls: ['./pruning.component.scss'],
  imports: [IonLabel, IonCheckbox, CommonModule, IonInput, IonItem],
})
export class PruningComponent {

  plantFormService = inject(PlantFormService);
  plantForm$ = this.plantFormService.plantForm$;

  monthRange = monthRange;


}
