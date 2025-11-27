import { Component, inject, OnInit } from '@angular/core';
import { IonLabel } from '@ionic/angular/standalone';
import { ChoicesComponent } from '../choices/choices.component';
import { PlantFormService } from '@/services/plant-form.service';
import { CommonModule } from '@angular/common';
import { ChoicesStorageService } from '@/services/choices-storage.service';
import { ChoiceName } from '@/enums/ChoiceEntry';

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
