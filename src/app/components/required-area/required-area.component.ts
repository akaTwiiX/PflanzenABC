import { requiredArea } from '@/consts/requiredArea';
import { PlantFormService } from '@/services/plant-form.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonCheckbox, IonItem, IonLabel } from '@ionic/angular/standalone';
import { RangeSliderComponent } from '../range-slider/range-slider.component';

@Component({
  selector: 'app-required-area',
  templateUrl: './required-area.component.html',
  styleUrls: ['./required-area.component.scss'],
  imports: [RangeSliderComponent, IonCheckbox, IonLabel, IonItem, CommonModule],
  standalone: true,
})
export class RequiredAreaComponent {
  plantFormService = inject(PlantFormService);
  plantForm$ = this.plantFormService.plantForm$;
  requiredArea = requiredArea;
}
