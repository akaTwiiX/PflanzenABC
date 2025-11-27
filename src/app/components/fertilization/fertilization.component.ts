import { Component, inject } from '@angular/core';
import { IonLabel, IonItem, IonCheckbox, IonInput } from '@ionic/angular/standalone';
import { ChoicesComponent } from '../choices/choices.component';
import { PlantFormService } from '@/services/plant-form.service';
import { CommonModule } from '@angular/common';
import { ChoicesStorageService } from '@/services/choices-storage.service';
import { ChoiceName } from '@/enums/ChoiceEntry';

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
