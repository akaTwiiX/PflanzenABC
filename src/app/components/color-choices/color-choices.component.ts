import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { IonCheckbox, IonText } from '@ionic/angular/standalone';
import { colorChoices } from '@/shared/consts/colorChoices';
import { PlantFormService } from '@/shared/services/plant-form.service';
import type { Plant } from '@/shared/types/PlantType';

@Component({
  selector: 'app-color-choices',
  templateUrl: './color-choices.component.html',
  styleUrls: ['./color-choices.component.scss'],
  imports: [IonCheckbox, CommonModule, IonText],
})
export class ColorChoicesComponent {
  @Input() choiceName!: string;
  @Input() title!: string;

  colors = colorChoices;

  plantFormService = inject(PlantFormService);

  toggleColor(color: string, currentColors: string[]) {
    const colors = [...currentColors];
    const index = colors.indexOf(color);

    if (index > -1) {
      colors.splice(index, 1);
    } else {
      colors.push(color);
    }

    this.plantFormService.update(this.choiceName, colors);
  }

  getColors(plant: Plant): string[] {
    const keys = this.choiceName.split('.');
    let value: any = plant;
    for (const key of keys) {
      value = value?.[key];
    }
    return (value as string[]) ?? [];
  }

  isSelected(currentColors: string[], color: string): boolean {
    return currentColors.includes(color);
  }
}
