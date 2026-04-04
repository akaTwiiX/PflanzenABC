import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonLabel } from '@ionic/angular/standalone';
import { icons, WaterRequirement, WaterRequirementLabel } from '../../shared/enums/WaterRequirements';
import { PlantFormService } from '../../shared/services/plant-form.service';
import type { SelectorOption } from '../selector/selector.component';
import { SelectorComponent } from '../selector/selector.component';

@Component({
  selector: 'app-water-selector',
  templateUrl: './water-selector.component.html',
  styleUrls: ['./water-selector.component.scss'],
  imports: [IonLabel, SelectorComponent, CommonModule],
})
export class WaterSelectorComponent {
  plantFormService = inject(PlantFormService);
  plantForm$ = this.plantFormService.plantForm$;

  readonly options: SelectorOption[] = Object.values(WaterRequirement).map(lr => ({
    value: lr,
    label: WaterRequirementLabel[lr],
    icon: icons[lr],
  }));
}
