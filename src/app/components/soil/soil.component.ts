import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonLabel } from '@ionic/angular/standalone';
import { ChoiceName } from '../../shared/enums/ChoiceEntry';
import { PlantFormService } from '../../shared/services/plant-form.service';
import { ChoicesComponent } from '../choices/choices.component';

@Component({
  selector: 'app-soil',
  templateUrl: './soil.component.html',
  styleUrls: ['./soil.component.scss'],
  imports: [CommonModule, FormsModule, IonLabel, ChoicesComponent],
})
export class SoilComponent {
  plantFormService = inject(PlantFormService);
  plantForm$ = this.plantFormService.plantForm$;
  ChoiceName = ChoiceName;
}
