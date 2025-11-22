import { colorChoices } from '@/consts/colorChoices';
import { PlantFormService } from '@/services/plant-form.service';
import { Plant } from '@/types/PlantType';
import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { IonCheckbox, IonText } from '@ionic/angular/standalone';

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
    return plant[this.choiceName as keyof Plant] as string[];
  }

  isSelected(currentColors: string[], color: string): boolean {
    return currentColors.includes(color);
  }
}
