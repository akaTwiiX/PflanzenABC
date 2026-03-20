import { ChoiceName } from '@/enums/ChoiceEntry';
import { ChoicesStorageService } from '@/services/choices-storage.service';
import { PlantFormService } from '@/services/plant-form.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonLabel } from '@ionic/angular/standalone';
import { ChoicesComponent } from '../choices/choices.component';

@Component({
  selector: 'app-leaf-shape',
  templateUrl: './leaf-shape.component.html',
  styleUrls: ['./leaf-shape.component.scss'],
  imports: [ChoicesComponent, IonLabel, CommonModule],
})
export class LeafShapeComponent {
  plantFormService = inject(PlantFormService);
  choiceStorageService = inject(ChoicesStorageService);
  plantForm$ = this.plantFormService.plantForm$;
  ChoiceName = ChoiceName;

}
