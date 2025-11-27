import { Component, inject, OnInit } from '@angular/core';
import { IonLabel } from '@ionic/angular/standalone';
import { SelectorComponent, SelectorOption } from '../selector/selector.component';
import { PlantFormService } from '@/services/plant-form.service';
import { icons, WaterRequirement, WaterRequirementLabel } from '@/enums/WaterRequirements';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-water-selector',
  templateUrl: './water-selector.component.html',
  styleUrls: ['./water-selector.component.scss'],
  imports: [IonLabel, SelectorComponent, CommonModule],
})
export class WaterSelectorComponent {
  plantFormService = inject(PlantFormService);
  plantForm$ = this.plantFormService.plantForm$;

  readonly options: SelectorOption[] = Object.values(WaterRequirement).map((lr) => ({
    value: lr,
    label: WaterRequirementLabel[lr],
    icon: icons[lr],
  }));
}
