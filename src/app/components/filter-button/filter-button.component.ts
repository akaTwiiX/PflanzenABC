import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCheckbox,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
} from '@ionic/angular/standalone';
import { distanceRange } from '../../shared/consts/distanceRange';
import { monthRange } from '../../shared/consts/monthRange';
import { icons, LightRequirement, LightRequirementLabel } from '../../shared/enums/LightRequirements';
import { CHECKBOX_ARRAY } from '../../shared/modals/plant-checkbox.config';
import type { Plant } from '../../shared/types/PlantType';
import type { RangeSliderType } from '../../shared/types/RangeSliderType';
import { RangeSliderComponent } from '../range-slider/range-slider.component';
import type { SelectorOption } from '../selector/selector.component';
import { SelectorComponent } from '../selector/selector.component';

interface rangeFilter {
  checked: boolean;
  range: RangeSliderType;
}

@Component({
  selector: 'app-filter-button',
  templateUrl: './filter-button.component.html',
  styleUrls: ['./filter-button.component.scss'],
  imports: [
    IonButton,
    IonIcon,
    IonModal,
    IonItem,
    IonList,
    IonCheckbox,
    IonLabel,
    FormsModule,
    SelectorComponent,
    RangeSliderComponent,
  ],
})
export class FilterButtonComponent {
  @Output() applyFiltersFn = new EventEmitter<Partial<Plant>>();
  @Output() resetFiltersFn = new EventEmitter<void>();

  readonly options: SelectorOption[] = Object.values(LightRequirement).map(lr => ({
    value: lr,
    label: LightRequirementLabel[lr],
    icon: icons[lr],
  }));

  checkboxArray = CHECKBOX_ARRAY;

  selected = [];

  distanceRange = distanceRange;
  monthRange = monthRange;

  height: rangeFilter = {
    checked: false,
    range: {
      start: distanceRange[0],
      end: distanceRange.at(-1)!,
    },
  };

  bloomTime: rangeFilter = {
    checked: false,
    range: {
      start: monthRange[0],
      end: monthRange.at(-1)!,
    },
  };

  get isChecked() {
    return (
      this.selected.length > 0
      || this.checkboxArray.some(box => box.checked)
      || this.height.checked
      || this.bloomTime.checked
    );
  }

  resetFilters() {
    this.selected = [];
    this.checkboxArray.forEach(box => (box.checked = false));
    this.height.checked = false;
    this.bloomTime.checked = false;

    this.resetFiltersFn.emit();
  }

  applyFilters() {
    const filter: Partial<Plant> = {};

    if (this.selected.length > 0) {
      filter.light = this.selected;
    }

    this.checkboxArray.forEach((box) => {
      if (box.checked) {
        filter[box.name] = box.checked;
      }
    });

    if (this.height.checked) {
      filter.height = this.height.range;
    }

    if (this.bloomTime.checked) {
      filter.bloomTime = this.bloomTime.range;
    }

    console.log(filter);

    this.applyFiltersFn.emit(filter);
  }
}
