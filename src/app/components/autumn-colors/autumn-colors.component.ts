import { ChoicesStorageService } from '@/services/choices-storage.service';
import { PlantFormService } from '@/services/plant-form.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonCheckbox, IonItem, IonLabel } from '@ionic/angular/standalone';
import { ColorChoicesComponent } from '../color-choices/color-choices.component';

@Component({
  selector: 'app-autumn-colors',
  templateUrl: './autumn-colors.component.html',
  styleUrls: ['./autumn-colors.component.scss'],
  imports: [ColorChoicesComponent, IonLabel, CommonModule, IonCheckbox, IonItem],
})
export class AutumnColorsComponent {
  plantFormService = inject(PlantFormService);
  choiceStorageService = inject(ChoicesStorageService);
  plantForm$ = this.plantFormService.plantForm$;
}
