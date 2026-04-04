import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonLabel } from '@ionic/angular/standalone';
import { ChoiceName } from '../../shared/enums/ChoiceEntry';
import { ChoicesStorageService } from '../../shared/services/choices-storage.service';
import { PlantFormService } from '../../shared/services/plant-form.service';
import { ChoicesComponent } from '../choices/choices.component';

@Component({
  selector: 'app-plant-type',
  templateUrl: './plant-type.component.html',
  styleUrls: ['./plant-type.component.scss'],
  imports: [IonLabel, ChoicesComponent, CommonModule],
})
export class PlantTypeComponent {
  plantFormService = inject(PlantFormService);
  choiceStorageService = inject(ChoicesStorageService);
  plantForm$ = this.plantFormService.plantForm$;
  ChoiceName = ChoiceName;
}
