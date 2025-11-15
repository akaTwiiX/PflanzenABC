import { icons, LightRequirement, LightRequirementLabel } from '@/enums/LightRequirements';
import { Component, inject } from '@angular/core';
import { SelectorComponent, SelectorOption } from "../selector/selector.component";
import { PlantFormService } from '@/services/plant-form.service';
import { CommonModule } from '@angular/common';
import { IonItem, IonLabel } from "@ionic/angular/standalone";

@Component({
  selector: 'app-light-selector',
  templateUrl: './light-selector.component.html',
  styleUrls: ['./light-selector.component.scss'],
  imports: [SelectorComponent, CommonModule, IonLabel],
})
export class LightSelectorComponent {
  plantFormService = inject(PlantFormService);
  plantForm$ = this.plantFormService.plantForm$;

  readonly options: SelectorOption[] = Object.values(LightRequirement).map(lr => ({
    value: lr,
    label: LightRequirementLabel[lr],
    icon: icons[lr],
  }));

  onChange(value: string[]) {
    
    if(value.length === 0) return

    this.plantFormService.update('light', [...value]);
  }

}
