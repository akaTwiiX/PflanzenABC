import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonLabel } from '@ionic/angular/standalone';
import { ChoiceName } from '../../shared/enums/ChoiceEntry';
import { ChoicesStorageService } from '../../shared/services/choices-storage.service';
import { PlantFormService } from '../../shared/services/plant-form.service';
import { ChoicesComponent } from '../choices/choices.component';

@Component({
  selector: 'app-root-system',
  templateUrl: './root-system.component.html',
  imports: [ChoicesComponent, IonLabel, CommonModule],
  styleUrls: ['./root-system.component.scss'],
})
export class RootSystemComponent {
  ChoiceName = ChoiceName;

  plantFormService = inject(PlantFormService);
  choiceStorageService = inject(ChoicesStorageService);
  plantForm$ = this.plantFormService.plantForm$;
}
