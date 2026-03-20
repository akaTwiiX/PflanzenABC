import { colorChoices } from '@/consts/colorChoices';
import { monthRange } from '@/consts/monthRange';
import { PlantFormService } from '@/services/plant-form.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonCheckbox, IonItem, IonLabel } from '@ionic/angular/standalone';
import { ColorChoicesComponent } from "../color-choices/color-choices.component";
import { RangeSliderComponent } from '../range-slider/range-slider.component';

@Component({
  selector: 'app-fruit',
  templateUrl: './fruit.component.html',
  styleUrls: ['./fruit.component.scss'],
  imports: [IonItem, IonLabel, IonCheckbox, RangeSliderComponent, CommonModule, ColorChoicesComponent],
})
export class FruitComponent {
  plantFormService = inject(PlantFormService);
  plantForm$ = this.plantFormService.plantForm$;
  monthRange = monthRange;
  colorChoices = colorChoices;
}
