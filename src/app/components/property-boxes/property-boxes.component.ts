import { Component, input } from '@angular/core';
import { IonButton, IonIcon, IonImg, IonLabel } from '@ionic/angular/standalone';
import { CheckboxItem } from '../../shared/modals/plant-checkbox.config';

@Component({
  selector: 'app-property-boxes',
  templateUrl: './property-boxes.component.html',
  styleUrls: ['../filter-button/filter-button.component.scss'],
  imports: [IonLabel, IonButton, IonIcon, IonImg],
})
export class PropertyBoxesComponent {
  readonly checkboxArray = input.required<CheckboxItem[]>();
  readonly toggleCheckbox = input.required<(item: CheckboxItem) => void>();
}
