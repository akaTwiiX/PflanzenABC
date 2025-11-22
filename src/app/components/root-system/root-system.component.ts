import { Component, inject } from '@angular/core';
import { ChoicesComponent } from '../choices/choices.component';
import { IonLabel } from '@ionic/angular/standalone';
import { ChoiceName } from '@/enums/ChoiceEntry';
import { PlantFormService } from '@/services/plant-form.service';
import { ChoicesStorageService } from '@/services/choices-storage.service';
import { CommonModule } from '@angular/common';

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
