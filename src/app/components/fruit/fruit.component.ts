import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonCheckbox, IonItem, IonLabel } from '@ionic/angular/standalone';
import { colorChoices } from '../../shared/consts/colorChoices';
import { monthRange } from '../../shared/consts/monthRange';
import { ChoiceName } from '../../shared/enums/ChoiceEntry';
import { PlantFormService } from '../../shared/services/plant-form.service';
import { ChoicesComponent } from '../choices/choices.component';
import { ColorChoicesComponent } from '../color-choices/color-choices.component';
import { RangeSliderComponent } from '../range-slider/range-slider.component';

@Component({
  selector: 'app-fruit',
  templateUrl: './fruit.component.html',
  styleUrls: ['./fruit.component.scss'],
  imports: [
    IonLabel,
    IonCheckbox,
    RangeSliderComponent,
    CommonModule,
    ColorChoicesComponent,
    ChoicesComponent,
    IonItem,
  ],
})
export class FruitComponent {
  plantFormService = inject(PlantFormService);
  plantForm$ = this.plantFormService.plantForm$;
  ChoiceName = ChoiceName;
  monthRange = monthRange;
  colorChoices = colorChoices;
}
