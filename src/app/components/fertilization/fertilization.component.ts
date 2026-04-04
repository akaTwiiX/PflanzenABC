import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonCheckbox, IonInput, IonItem, IonLabel } from '@ionic/angular/standalone';
import { ChoiceName } from '../../shared/enums/ChoiceEntry';
import { ChoicesStorageService } from '../../shared/services/choices-storage.service';
import { PlantFormService } from '../../shared/services/plant-form.service';
import { ChoicesComponent } from '../choices/choices.component';

@Component({
  selector: 'app-fertilization',
  templateUrl: './fertilization.component.html',
  styleUrls: ['./fertilization.component.scss'],
  imports: [IonLabel, ChoicesComponent, CommonModule, IonCheckbox, IonItem, IonInput],
})
export class FertilizationComponent {
  plantFormService = inject(PlantFormService);
  plantForm$ = this.plantFormService.plantForm$;
  choiceStorageService = inject(ChoicesStorageService);
  ChoiceName = ChoiceName;

  constructor() {}
}
